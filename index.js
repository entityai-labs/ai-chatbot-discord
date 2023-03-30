require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');
const {Configuration, OpenAIApi } = require('openai');

const client = new Client({
	intents: [
       IntentsBitField.Flags.Guilds,
       IntentsBitField.Flags.GuildMessages,
       IntentsBitField.Flags.MessageContent,
		]
});



let status = [
  {
    name: 'Running...',
    type: ActivityType.Playing,
  },
  
  
];
client.on("ready", (c) => {
	console.log(`${c.user.tag} está online.`)
      setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 20000);
});

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.channel.id !== process.env.CHANNEL_ID) return;
	if (message.content.startsWith('!')) return;

	let conversationLog = [{role: 'system', content: "You are a friendly chatbot."}];

	conversationLog.push({
      role: 'user',
      content: message.content,
	});

	await message.channel.sendTyping();

	const result = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: conversationLog,
	});

	message.reply(result.data.choices[0].message);
});

client.login(process.env.TOKEN);