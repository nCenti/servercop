const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: 'Unlock a channel',
    async run(message) {
        const channel = message.channel;

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('You do not have permission to manage channels.');
        }


        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SendMessages: true,
        });
        return message.reply(`🔓 ${channel} se ha abierto correctamente✅`);
    },
};
