const tmi = require('tmi.js');
const axios = require('axios');
require('dotenv').config();
const client = new tmi.Client({
	options: { debug: false },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: 'wptaxado',
		password: process.env.TOKEN
	},
	channels: [ 'taina420', 'luisaodonto' ]
});

const wpseusafado = new tmi.Client({
	options: { debug: false },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: 'wpseusafado',
		password: process.env.TOKEN_WPSEUSAFADO
	},
	channels: [ 'taina420', 'luisaodonto', 'wptaxado' ]
});

wpseusafado.connect().catch(console.error);
client.connect().catch(console.error);

const moment = require('moment');
require('moment-timezone').tz("America/Sao_Paulo").format();

let canSendMovie = true;
let canSendInsta = true;

setInterval(() => {
    canSendMovie = true;
}, 60000);

setInterval(() => {
    canSendInsta = true;
}, 600000);

const getTime = function() {
    const now  = "21/11/2020 " + moment().format("HH:mm:ss");
    const then = "22/11/2020 11:10:01";
    total_hours = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss")));
    missing_hours = moment.utc(moment(moment().format("DD/MM/YYYY HH:mm:ss"), "DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss")));
    return moment.utc(moment(then, "DD/MM/YYYY HH:mm:ss").diff(moment(now, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm");
}

let wpplink = "https://chat.whatsapp.com/HIN0kfOEtmGDuxqYYoCx4w"
const subMessage = `Muito obrigado pelo sub! Ta ganhando 3x mais pontos na !loja,
grupo exclusivo do whats,
Followback no instagram,
participando dos sorteios exclusivos e minha eterna gratidão. Link do grupo do whatss ${wpplink}`


client.on('message', async (channel, tags, message, self) => {
    if(self) return;
    if (message.toLowerCase().match(/(\s?q\s|que|qual|ql).*(^filme|\sfilme\s|\sfilme).*\?+/ig)) {
        //client.say(channel, `/me WPBOT: @${tags.username} No Limite do Amanhã`);
    }

    if (message.toLowerCase().match(/(q|que|qual|ql).*(^temp|\stemp\s|\stemp).*\?+/ig)) {
        // client.say(channel, `/me WPBOT: @${tags.username} 1 Temporada`);
    }

    if(message.toLowerCase().match(/(!time$|!tempo$|!t$)/ig)) {
        // console.log(`/me WPBOT: @${tags.username} faltam ${getTime()}`);
        // client.say(channel, `/me WPBOT: @${tags.username} faltam ${getTime()}`);
    }

    if (message.toLowerCase().match(/(qual\s|tem\s|tm\s).*(^onlyfans|\sonly fans|\sonly fãs).*\?+/ig)) {
        wpseusafado.say(channel, `/me WPBOT: @${tags.username} Não! ela não tem onlyfans.`);
    }

    if (message.toLowerCase().match(/(vende\s).*(\spack).*\?+/ig)) {
        wpseusafado.say(channel, `/me WPBOT: @${tags.username} Não! ela não vende packs.`);
    }

    if (message.toLowerCase().match(/doou\s+\[R\$(.*)\]/ig)) {
        wpseusafado.say(channel, `/timeout @${tags.username} 600`);
    }

    if (message.toLowerCase() === "!wpp") {
        if (!tags.subscriber) {
            client.say(channel, `/me Se quiser entrar no grupo do whats dos gados, da aquela força no sub @${tags.username}.`);
        } else if (tags.mod) {
            setTimeout(() => {
                client.whisper(tags.username, `/me Link atualizado do grupo dos Gadinhos da Tai ${wpplink}`);
            }, 4000)
        } else if (tags.subscriber) {
            setTimeout(() => {
                client.whisper(tags.username, `/me Link atualizado do grupo dos Gadinhos da Tai ${wpplink}`);
            }, 4000)
        } else if (!!(tags['badges-raw'].match(/(broadcaster\/1)/ig))) {
            setTimeout(() => {
                client.whisper(tags.username, `/me Link atualizado do grupo dos Gadinhos da Tai ${wpplink}`);
            }, 4000)
        }
    }

    if(message.toLowerCase() === "!temperatura") {
        const params = {
            access_key: '6fbcc85784df36403b4f8b86397ab4ea',
            query: 'Chapecó',
            units: 'm'
        }
        const { data: apiResponse } = await axios.get('http://api.weatherstack.com/current', {params});
        wpseusafado.say(channel, `/me Temperatura atual em ${apiResponse.location.name} é de ${apiResponse.current.temperature}℃`);
    }

    if (message.toLowerCase().match(/(desce|abaixa|).*(camera|câmera|cam).*\?+/ig)) {
        client.say(channel, `/timeout @${tags.username} 10`);
    }

    if (message.toLowerCase().match(/▄▄▀▀█/mi)) {
        client.say(channel, `/ban @${tags.username}`);
    }
    if (message.toLowerCase().match(/(WEBCAM HACKED|الويب)/)) {
        client.say(channel, `/ban @${tags.username}`);
    }

    if (message.toLowerCase().match(/^!temperatura (.*)/mi)) {
        const clima = message.toLowerCase().match(/^!temperatura (.*)/mi);
        if (clima) {
            const params = {
                access_key: process.env.ACCESS_KEY,
                query: clima[1],
                units: 'm'
            }
            const { data: apiResponse, status } = await axios.get('http://api.weatherstack.com/current', {params});
            if (!(apiResponse['error'])) {
                // console.log(`Temperatura atual em ${apiResponse.location.name} é de ${apiResponse.current.temperature}℃`);
                wpseusafado.say(channel, `/me Temperatura atual em ${apiResponse.location.name} é de ${apiResponse.current.temperature}℃`);
            } else {
                // console.log(`Não consegui localizar essa cidade srry @${tags.username} :(.`);
                wpseusafado.say(channel, `/me Não consegui localizar essa cidade srry @${tags.username} :(.`);
            }
        }
    }
});

