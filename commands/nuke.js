const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'nuke',
    description: 'Elimina mensajes en el canal actual. Usa !nuke channel para borrar todos los mensajes o !nuke (cantidad) para borrar una cantidad específica.',
    async run(message, args) {
        // Verifica que el usuario tenga permisos para gestionar mensajes
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('No tienes permiso para gestionar mensajes en este canal.');
        }

        const deleteMessages = async (channel, amount) => {
            let totalDeleted = 0;
            while (totalDeleted < amount) {
                // Obtener hasta 100 mensajes
                const fetched = await channel.messages.fetch({ limit: Math.min(100, amount - totalDeleted) });
                if (fetched.size === 0) break;

                // Eliminar los mensajes
                await channel.bulkDelete(fetched, true);
                totalDeleted += fetched.size;

                // Esperar 1 segundo entre borrados para evitar problemas de límite de velocidad
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            return totalDeleted;
        };

        const sendEmbed = (title, description, color) => {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
                .setTimestamp()
                .setFooter({ text: 'Comando ejecutado por ' + message.author.username, iconURL: message.author.displayAvatarURL() });

            return message.channel.send({ embeds: [embed] });
        };

        if (args[0] === 'channel') {
            try {
                // Eliminar todos los mensajes en el canal
                const totalDeleted = await deleteMessages(message.channel, Infinity);
                sendEmbed('🚮 Canal Limpiado', `El canal ha sido limpiado. ${totalDeleted} mensajes eliminados.`, 'Aqua');
            } catch (error) {
                console.error(`Error al eliminar mensajes: ${error.message}`);
                sendEmbed('❌ Error', 'Hubo un error al intentar eliminar los mensajes.', '#FF0000');
            }
        } else {
            // Intentar eliminar una cantidad específica de mensajes
            const amount = parseInt(args[0], 10);
            if (isNaN(amount) || amount <= 0 || amount > 100) {
                return message.reply('Por favor, proporciona una cantidad válida de mensajes para eliminar (de 1 a 100).');
            }

            try {
                const totalDeleted = await deleteMessages(message.channel, amount);
                sendEmbed('<a:nuke_Warning_hazard:1287824677204398080> Mensajes Eliminados', `Se han eliminado ${totalDeleted} mensajes.`, 'Aqua');
            } catch (error) {
                console.error(`Error al eliminar mensajes: ${error.message}`);
                sendEmbed('❌ Error', 'Hubo un error al intentar eliminar los mensajes.', '#FF0000');
            }
        }
    },
};
