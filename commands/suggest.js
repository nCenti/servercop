const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'suggestConfig.json');

module.exports = {
    name: 'suggest',
    description: 'Envía una sugerencia o configura el canal para las sugerencias',
    async run(message, args) {
        let suggestConfig = {};
        if (fs.existsSync(configPath)) {
            suggestConfig = JSON.parse(fs.readFileSync(configPath));
        }

        if (args[0] === 'set') {
            if (!message.member.permissions.has('MANAGE_GUILD')) {
                return message.reply('No tienes permiso para establecer el canal de sugerencias.');
            }

            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.reply('Por favor, menciona un canal válido.');
            }

            suggestConfig.suggestChannelId = channel.id;
            fs.writeFileSync(configPath, JSON.stringify(suggestConfig, null, 2));
            return message.reply(`El canal de sugerencias ha sido configurado a ${channel}`);
        }

        const suggestChannelId = suggestConfig.suggestChannelId;
        if (!suggestChannelId) {
            return message.reply('El canal de sugerencias no está configurado. Usa `!suggest set #canal`.');
        }

        const suggestion = args.join(' ');
        if (!suggestion) {
            return message.reply('Por favor, proporciona una sugerencia.');
        }

        const embed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle('*Nueva sugerencia*')
            .setDescription(suggestion)
            .addFields({ name: 'Votos:', value: '👍 0 | 👎 0 | Total: 0' })
            .setFooter({ 
                text: `Sugerido por ${message.author.tag} | servername`, 
                iconURL: message.author.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        const suggestChannel = message.guild.channels.cache.get(suggestChannelId);
        const suggestMessage = await suggestChannel.send({ embeds: [embed] });

        const upvoteButton = new ButtonBuilder()
            .setCustomId('upvote')
            .setLabel('👍 Votar a Favor')
            .setStyle(ButtonStyle.Success);

        const downvoteButton = new ButtonBuilder()
            .setCustomId('downvote')
            .setLabel('👎 Votar en Contra')
            .setStyle(ButtonStyle.Danger);

        const removeVoteButton = new ButtonBuilder()
            .setCustomId('removeVote')
            .setLabel('❌ Eliminar Voto')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton, removeVoteButton);
        await suggestMessage.edit({ components: [row] });

        message.reply({ content: 'Tu sugerencia ha sido enviada con éxito.', ephemeral: true });

        const filter = (interaction) => interaction.customId === 'upvote' || interaction.customId === 'downvote' || interaction.customId === 'removeVote';
        const collector = suggestMessage.createMessageComponentCollector({ filter, time: 24 * 60 * 60 * 1000 });

        const userVotes = new Map();
        let upvotes = 0;
        let downvotes = 0;

        collector.on('collect', async (interaction) => {
            const userId = interaction.user.id;

            if (interaction.customId === 'upvote') {
                if (userVotes.has(userId)) {
                    return interaction.reply({ content: 'Ya has votado por esta sugerencia.', ephemeral: true });
                }
                userVotes.set(userId, 'upvote');
                upvotes++;
            } else if (interaction.customId === 'downvote') {
                if (userVotes.has(userId)) {
                    return interaction.reply({ content: 'Ya has votado por esta sugerencia.', ephemeral: true });
                }
                userVotes.set(userId, 'downvote');
                downvotes++;
            } else if (interaction.customId === 'removeVote') {
                const vote = userVotes.get(userId);
                if (!vote) {
                    return interaction.reply({ content: 'No has votado por esta sugerencia.', ephemeral: true });
                }
                userVotes.delete(userId);
                if (vote === 'upvote') {
                    upvotes--;
                } else if (vote === 'downvote') {
                    downvotes--;
                }
            }

            const totalVotes = upvotes - downvotes;
            const updatedEmbed = EmbedBuilder.from(embed)
                .spliceFields(0, 1, { name: 'Votos:', value: `👍 ${upvotes} | 👎 ${downvotes} | Total: ${totalVotes}` });

            await suggestMessage.edit({ embeds: [updatedEmbed] });
            await interaction.reply({ content: 'Tu acción ha sido registrada.', ephemeral: true });
        });

        collector.on('end', async () => {
            await suggestMessage.edit({ components: [] });
        });
    },
};
