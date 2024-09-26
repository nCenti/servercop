const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reroll',
    description: 'Sortear un ganador para el sorteo en el mensaje anterior sin esperar.',
    async run(message) {
        // Verifica que el usuario tenga permisos para gestionar mensajes
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('No tienes permiso para gestionar sorteos.');
        }

        // Intenta obtener el mensaje anterior
        const fetchedMessages = await message.channel.messages.fetch({ limit: 2 });
        const giveawayMessage = fetchedMessages.last();

        if (!giveawayMessage) {
            return message.reply('No se encontró ningún sorteo para sortear.');
        }

        // Asegúrate de que el mensaje sea un sorteo
        const embed = giveawayMessage.embeds[0];
        if (!embed || !embed.title.includes('🎉 ¡Sorteo! 🎉')) {
            return message.reply('El mensaje anterior no es un sorteo.');
        }

        // Obtiene los usuarios que reaccionaron con 🎉
        const users = await giveawayMessage.reactions.cache.get('🎉').users.fetch();
        users.delete(message.client.user.id); // Elimina al bot de la lista de participantes

        if (users.size === 0) {
            return message.channel.send('No hubo participantes en el sorteo para sortear.');
        }

        // Selecciona un nuevo ganador al azar
        const winner = users.random();

        // Envía un mensaje anunciando al nuevo ganador
        const winnerEmbed = new EmbedBuilder()
            .setColor('#00FF00') // Color verde
            .setTitle('🏆 ¡Nuevo ganador! 🏆')
            .setDescription(`Felicidades <@${winner.id}>! Has ganado el sorteo!`)
            .setTimestamp();

        message.channel.send({ embeds: [winnerEmbed] });
    },
};
