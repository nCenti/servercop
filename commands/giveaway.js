const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'giveaway',
    description: 'Crea un sorteo. Uso: !giveaway (premio) (tiempo en horas)',
    async run(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('No tienes permiso para gestionar sorteos.');
        }

        if (args.length < 2) {
            return message.reply('Por favor, proporciona un premio y un tiempo en horas.');
        }

        const prize = args.slice(0, -1).join(' ');
        const time = parseInt(args[args.length - 1]); 

        if (isNaN(time) || time <= 0) {
            return message.reply('Por favor, proporciona un tiempo válido en horas.');
        }

        const embed = new EmbedBuilder()
            .setColor('#FFD700') 
            .setTitle('🎉 ¡Sorteo! 🎉')
            .setDescription(`Premio: **${prize}**\nReacciona con 🎉 para participar!`)
            .setTimestamp(Date.now() + time * 60 * 60 * 1000) 
            .setFooter({ text: 'El sorteo terminará en ' + time + ' horas.' });

        const giveawayMessage = await message.channel.send({ embeds: [embed] });
        await giveawayMessage.react('🎉');

        setTimeout(async () => {
            const fetchedMessage = await message.channel.messages.fetch(giveawayMessage.id);
            const users = await fetchedMessage.reactions.cache.get('🎉').users.fetch();

            users.delete(message.client.user.id);

            if (users.size === 0) {
                return message.channel.send('No hubo participantes en el sorteo.');
            }

            const winner = users.random();

            const winnerEmbed = new EmbedBuilder()
                .setColor('#00FF00') 
                .setTitle('🏆 ¡El ganador es! 🏆')
                .setDescription(`Felicidades <@${winner.id}>! Has ganado **${prize}**!`)
                .setTimestamp();

            message.channel.send({ embeds: [winnerEmbed] });
        }, time * 60 * 60 * 1000); 
    },
};
