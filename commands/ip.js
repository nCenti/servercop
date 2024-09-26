module.exports = {
    name: 'ip',
    description: 'Muestra la dirección IP del servidor',
    async run(message) {
        return message.channel.send("play.servername.net");
    },
};
