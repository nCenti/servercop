const { EmbedBuilder } = require('discord.js');

module.exports = {
    
    name: 'media',
    description: 'Requisitos Media',

    
    async run(message, args) {
        
        if (args[0] === 'youtube') {

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('📷 <:yt:1286729394852855899> Youtube:')
            .setDescription(`
                **Requisitos:**
                - **Famous**
                ➜ +1000 Subscriptores +500 views por video.
                 - **Media**
                ➜ +500 Subscriptores +250 views por video.
                 - **MiniMedia**
                ➜ +100 Subscriptores +50 views por video.
            `);

        return message.channel.send({ embeds: [embed] });
    }
     
    if (args[0] === 'twitch') {

    const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle('📷 <:twitch:1286732305175547975> Twitch:')
        .setDescription(`
            **Requisitos:**
            - **Famous**
            ➜ +1000 Seguidores +150 de media.
             - **Media**
            ➜ +500 Seguidores +80 de media.
             - **MiniMedia**
            ➜ +100 Seguidores +10 de media.
        `);

    return message.channel.send({ embeds: [embed] });
    }
if (args[0] === 'tiktok') {

    const embed = new EmbedBuilder()
        .setColor('Default')
        .setTitle('📷 <:tiktok:1286734861239062528> Twitch:')
        .setDescription(`
            **Requisitos:**
            - **Famous**
            ➜ +10000 Seguidores +150000 likes.
             - **Media**
            ➜ +5000 Seguidores +8000 likes.
             - **MiniMedia**
            ➜ +2000 Seguidores +5000 likes
        `);

    return message.channel.send({ embeds: [embed] });
}
return message.channel.send('Por favor, especifica un tipo de media válido: `youtube`, `twitch` o `tiktok`.');
},
}
