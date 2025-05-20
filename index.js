require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

const MEMORY_FILE = 'memory.json';

function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return { messages: [], dolbaebs: {} };
  try {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
  } catch {
    return { messages: [], dolbaebs: {} };
  }
}

function saveMemory() {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify({
    messages: messageMemory,
    dolbaebs: dolbaebDayCache
  }, null, 2));
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

let { messages: messageMemory, dolbaebs: dolbaebDayCache } = loadMemory();
let messageCount = 0;

client.once('ready', () => {
  console.log(`Бот запустился как ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim().toLowerCase();

  // === dolbaebday команда ===
  if (content === 'w.dolbaebday') {
    const guildId = message.guild.id;
    const today = new Date().toDateString();

    if (dolbaebDayCache[guildId]?.date === today) {
      const user = await message.guild.members.fetch(dolbaebDayCache[guildId].userId);
      return await message.reply(`Сегодняшний долбаёб дня уже выбран: 🎉 <@${user.id}> 🎉`);
    }

    const members = await message.guild.members.fetch();
    const filtered = members.filter(m => !m.user.bot);
    if (filtered.size === 0) {
      return await message.channel.send('Не могу выбрать долбаёба, нет участников.');
    }

    const randomMember = filtered.random();
    dolbaebDayCache[guildId] = { userId: randomMember.id, date: today };
    saveMemory();

    return await message.channel.send(`🎉 Долбаёб дня: <@${randomMember.id}> 🎉`);
  }

  // === Пинг на бота ===
  if (message.mentions.has(client.user)) {
    const reply = generateStupidMessage();
    if (reply) return message.reply(reply);
  }

  // === Запоминаем сообщение ===
  messageMemory.push(content);
  if (messageMemory.length > 500) messageMemory.shift(); // ограничим память

  messageCount++;

  if (messageCount >= 10) {
    messageCount = 0;
    const response = generateStupidMessage();
    if (response) message.channel.send(response);
  }

  saveMemory();
});

function generateStupidMessage() {
  if (messageMemory.length === 0) return null;
  const shuffled = [...messageMemory].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);
  return selected.join(' ').slice(0, 2000);
}

client.login(process.env.DISCORD_TOKEN);
