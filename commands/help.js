const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Muestra la lista de comandos disponibles',
    async run(message) {
        const embed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle('💎 Comandos:')
            .setDescription(`
                **Lista de comandos:**
                - **!ip**: Muestra la dirección IP del servidor.
                - **!tienda**: Muestra la dirección de la tienda.
                - **!ticket**: Crea un nuevo ticket.
                - **!lock**: Bloquea el canal.
                - **!unlock**: Desbloquea el canal.
                - **!nuke**: Borra una cantidad de mensajes o todos los del canal.
                - **!giveaway**: Crea un sorteo.
                - **!roll**: Rollea el sorteo.
                - **¡Pronto más!**: Mantente atento para más comandos.
            `);

        return message.channel.send({ embeds: [embed] });
    },
};
