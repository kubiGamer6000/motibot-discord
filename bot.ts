const Discord = require('discord.js');
const nfetch = require('node-fetch');
require('dotenv').config();
const flatUiColors = require('flat-ui-colors').default;
const bot = new Discord.Client();

let quoteSent = false;

async function randomQuote() {
	const response = await nfetch('https://api.quotable.io/random');
	const data = await response.json();
	return { quote: data.content, author: data.author };
}

randomQuote();

bot.on('ready', () => {
	console.log('Logged in!');
});

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
	version: '2019-10-10',
	authenticator: new IamAuthenticator({
		apikey: process.env.TONE_ANALYZER_IAM_APIKEY
	}),
	url: process.env.TONE_ANALYZER_URL
});

bot.on('message', async (msg) => {
	if (msg.author.bot) return;
	const toneParams = {
		toneInput: { text: msg.content },
		contentType: 'application/json'
	};

	const toneAnalysis = await toneAnalyzer.tone(toneParams);
	toneAnalysis.result.document_tone.tones.forEach(async (el) => {
		if (el.tone_name == 'Sadness' && !quoteSent) {
			const quote = randomQuote();
			msg.channel.send(
				new Discord.MessageEmbed()
					.setColor(flatUiColors.get.one())
					.setTitle(`Don't be sad! Here is a wise quote.`)
					.addField((await quote).author, (await quote).quote)
					.setFooter('Made by dolanbright')
			);
			quoteSent = true;
		}
	});
	quoteSent = false;
});

bot.login(process.env.BOT_TOKEN);
