module.exports = {
    name: 'tienda',
    description: 'Muestra la dirección de la tienda',
    async run(message) {
        return message.channel.send("tienda.servername.net");
    },
};
