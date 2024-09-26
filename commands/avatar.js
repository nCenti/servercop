const { EmbedBuilder } = require('discord.js');

module.exports = {
    description: "Muestra el avatar de un usuario",
    run: async (message, args) => {
        // Asegúrate de que 'message' es un objeto 'Message' de Discord.js
        if (!message.guild) {
            return message.channel.send("Este comando solo se puede usar en un servidor.");
        }

        // Obtén el usuario mencionado o el usuario por ID
        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;

        // Verifica si se mencionó un usuario
        if (!target) {
            return message.channel.send("Por favor, menciona a un usuario válido o proporciona un ID válido.");
        }

        try {
            // Obtiene el miembro del servidor
            const member = await message.guild.members.fetch(target.id);

            const avatar = member.user.displayAvatarURL({ size: 512, dynamic: true });

            // Crea el embed
            const embed = new EmbedBuilder()
                .setColor('Aqua')
                .setTitle(`💎 Avatar de ${member.user.tag}`)
                .setImage(avatar);

            // Envía el embed
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            // Si ocurre un error, lo mostramos en la consola y enviamos un mensaje
            console.error(`Error al obtener el avatar: ${error}`);
            message.channel.send("Hubo un error al obtener el avatar de ese usuario.");
        }
    }
};
