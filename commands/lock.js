const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Lock a channel',
    async run(message) {
        const channel = message.channel;

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('You do not have permission to manage channels.');
        }

        // Lock the channel
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SendMessages: false,
        });
        return message.reply(`🔒 ${channel} fue cerrado correctamente✅.`);
    },
};
