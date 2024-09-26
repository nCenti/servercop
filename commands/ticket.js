const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');

let ticketCount = 0;
let selectedCategory = '';

module.exports = {
    description: "Crea un sistema de tickets con menú de selección y formulario",
    run: async (message, args) => {
        const embed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle('🎟️ Sistema de Tickets')
            .setDescription('Selecciona la categoría del ticket que deseas abrir:')
            .setImage('https://share.creavite.co/66ec75105e75751a09602e2e.gif');

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket-category')
                    .setPlaceholder('Selecciona una categoría')
                    .addOptions([
                        { label: 'Soporte', description: 'Recibe ayuda para resolver tus problemas en el servidor', value: 'support', emoji: '<:user_help:1287822918398771211>' },
                        { label: 'Tienda', description: 'Recibe ayuda con tus compras en la tienda', value: 'store', emoji: '<a:Buy:1287823520591773746>' },
                        { label: 'Apelacion', description: 'Si crees que tu castigo es injusto, elige esta categoria', value: 'appeal', emoji: '<a:appeal:1287823620462084146>' },
                        { label: 'Reclamo', description: 'Reclama rangos, premios, recompensas, etc', value: 'claim', emoji: '<a:giveaway_minecraft2:1287823948159127624>' },
                        { label: 'Reporte', description: 'Reportar a usuarios o staff', value: 'report', emoji: '<a:report:1287824050994942003>' }
                    ])
            );

        await message.channel.send({ embeds: [embed], components: [row] });

        // Manejar la selección del menú desplegable
        message.client.on('interactionCreate', async interaction => {
            if (interaction.isSelectMenu() && interaction.customId === 'ticket-category') {
                selectedCategory = interaction.values[0]; // Guardar la categoría seleccionada
                const modal = new ModalBuilder()
                    .setCustomId('ticketModal')
                    .setTitle('Formulario de Ticket')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('minecraftName')
                                .setLabel('Nombre de Minecraft')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('reason')
                                .setLabel('Razón del ticket')
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
            }


            if (interaction.isModalSubmit() && interaction.customId === 'ticketModal') {
                const minecraftName = interaction.fields.getTextInputValue('minecraftName');
                const reason = interaction.fields.getTextInputValue('reason');

                ticketCount++;

                const ticketChannel = await message.guild.channels.create({
                    name: `ticket-${ticketCount}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        },
                        {
                            id: message.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: message.guild.roles.cache.find(role => role.permissions.has(PermissionsBitField.Flags.Administrator))?.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        }
                    ]
                });

                const ticketEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`📩 Nuevo Ticket #${ticketCount}`)
                    .setDescription(`🙍‍♂️ Usuario: <@${interaction.user.id}>`);


                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close-ticket')
                            .setLabel('Cerrar Ticket')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('transcript-ticket')
                            .setLabel('Transcript')
                            .setStyle(ButtonStyle.Primary)
                    );

                await ticketChannel.send({ embeds: [ticketEmbed], components: [buttonRow] });

                const formInfoEmbed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('📋 Información del Ticket')
                    .setDescription(`**Nombre de Minecraft:** ${minecraftName}\n**Categoría:** ${selectedCategory}\n**Razón:** ${reason}`);

                await ticketChannel.send({ embeds: [formInfoEmbed] });

                await interaction.reply({
                    content: `Tu ticket ha sido creado con el número **#${ticketCount}**. Puedes acceder al canal <#${ticketChannel.id}>.`,
                    ephemeral: true
                });
            }


            if (interaction.isButton()) {
                if (interaction.customId === 'close-ticket') {
                    await interaction.reply({ content: 'Este ticket se cerrará en 10 segundos...', ephemeral: true });
                    
                    setTimeout(async () => {
                        await interaction.channel.delete();
                    }, 10000); 
                }

                if (interaction.customId === 'transcript-ticket') {
                    const transcriptCategory = 'transcripts'; 
                    const transcriptChannelName = `transcript-${ticketCount}`;

                    const oldChannel = interaction.channel;
                    const guild = interaction.guild;

                    const transcriptCategoryChannel = guild.channels.cache.find(ch => ch.name === transcriptCategory && ch.type === ChannelType.GuildCategory);
                    if (transcriptCategoryChannel) {
                        await oldChannel.setParent(transcriptCategoryChannel.id);
                        await oldChannel.setName(transcriptChannelName);


                        await oldChannel.permissionOverwrites.edit(interaction.user.id, {
                            ViewChannel: false,
                            SendMessages: false
                        });

                        await interaction.reply({ content: `El ticket ha sido movido a la categoría de transcripts y renombrado a **${transcriptChannelName}**.`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'No se pudo encontrar la categoría de transcripts.', ephemeral: true });
                    }
                }
            }
        });
    }
};
