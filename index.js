require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

let memory = {
  messages: [],
  dolbaebs: {}
};

// Загрузка памяти
try {
  if (fs.existsSync('memory.json')) {
    memory = JSON.parse(fs.readFileSync('memory.json', 'utf8'));
  }
} catch (err) {
  console.error('Ошибка загрузки памяти:', err);
}

let messageCount = 0;

client.once('ready', () => {
  console.log(`Бот запустился как ${client.user.tag}`);
  client.user.setActivity('zxcursed', { type: 2 }); // type 0 = Playing
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
  const guildId = message.guild?.id;

  // === Команда w.dolbaebday ===
  if (content.toLowerCase() === 'w.dolbaebday' && guildId) {
    const today = new Date().toDateString();

    if (memory.dolbaebs[guildId]?.date === today) {
      return message.reply(`Сегодняшний долбаёб дня уже выбран: 🎉 <@${memory.dolbaebs[guildId].userId}> 🎉`);
    }

    const members = await message.guild.members.fetch();
    const filtered = members.filter(m => !m.user.bot);
    if (filtered.size === 0) return message.reply('Нет участников для выбора.');

    const randomMember = filtered.random();
    memory.dolbaebs[guildId] = { userId: randomMember.id, date: today };
    saveMemory();

    return message.channel.send(`🎉 Долбаёб дня: <@${randomMember.id}> 🎉`);
  }

  // === Команда w.ask ===
  if (content.toLowerCase().startsWith('w.ask')) {
    const question = content.slice(5).trim();
    if (!question) return message.reply('Задай вопрос. Пример: `w.ask стоит ли пить?`');

    const yesAnswers = [
      'ДА', 'конечно', 'ХАХАХА ДА ДА ДА', 'да, очевидно',
      'ДА, БРАТ', 'сам бог велел', 'безусловно', 'давай!'
    ];

    const noAnswers = [
      'НЕТ', 'НЕТ БЛЯТЬ', 'АХАХАХ НЕЕЕЕТ', 'нет, долбоёб',
      'да ну нахуй', 'ни в коем случае', 'нет, даже не думай'
    ];

    const isYes = Math.random() < 0.5;
    const finalAnswer = isYes
      ? yesAnswers[Math.floor(Math.random() * yesAnswers.length)]
      : noAnswers[Math.floor(Math.random() * noAnswers.length)];

    return message.reply(`🔮 ${finalAnswer}`);
  }

  if (content === 'w.zov') {
    try {
      await message.channel.send('🙏❤️ Читаем молитву...');
      setTimeout(() => {
        const phrases = [
          'HАШ Слава Богу 🙏❤️СЛАВА РОССИИ 🙏❤️АНГЕЛА ХРАНИТЕЛЯ КАЖДОМУ ИЗ ВАС 🙏❤️БОЖЕ ХРАНИ РОССИЮ 🙏❤️СПАСИБО ВАМ НАШИ МАЛЬЧИКИ 🙏🏼❤️🇷🇺 ЧТО ПОДДЕРЖИМ НАШИХ СРАЗУ видно НАШ СЛОНЯРА🇷🇺🇷🇺💪 СВО слава тебе Господи🇷🇺🇷🇺🇷🇺💪🔥🔥 СВО да хранит ТЕБЯ ГОСПОДЬ🔥💪💪🇷🇺 НАШ живчик СРАЗУ видно НАШИХ парней издалека🇷🇺🇷🇺🇷🇺🇷🇺💪💪💪💪💪 СВОих не бросаем🇷🇺🇷🇺🇷🇺🇷🇺🇷🇺🇷🇺🇷🇺🇷🇺🇷🇺💪💪Слава Богу СВО🙏❤️СЛАВА СВО🙏❤️АНГЕЛА ХРАНИТЕЛЯ СВО КАЖДОМУ ИЗ ВАС🙏❤️БОЖЕ ХРАНИ СВО🙏❤️СПАСИБО ВАМ НАШИ СВО🙏🏼❤️🇷🇺 ХРОНИ СВО✊🇷🇺💯СПАСИБО ВАМ НАШИ МАЛЬЧИКИ 🙏🏼❤️🇷🇺 ЧТО ПОДДЕРЖИВАЕТЕ СВО',
          'Слава Богу Z🙏❤️СЛАВА Z🙏❤️АНГЕЛА ХРАНИТЕЛЯ Z КАЖДОМУ ИЗ ВАС🙏❤️БОЖЕ ХРАНИ Z🙏❤️СПАСИБО ВАМ НАШИ СВО🙏🏼❤️🇷🇺 ХРАНИ ZOV✊🇷🇺💯СПАСИБО НАШИМ БОЙЦАМСлава Богу Z🙏❤️СЛАВА Z🙏❤️АНГЕЛА ХРАНИТЕ',
          'СлаVа Богу Z🙏❤️СVАВА Z🙏❤️АНГЕЛА ХРАНИТЕЛЯ Z КАЖДОМУ ИЗ ВАС🙏❤️БОЖЕ ХРАНИ Z🙏❤️СПАСИБО VАМ НАШИ СВО🙏🏼❤️🇷🇺 ХРАНИ ZСлаVа Богу Z🙏❤️',
          'Слава Богу ЗАПРЕТ🙏❤️🇷🇺СЛАВА ЗАПРЕТУ🙏❤️🇷🇺АНГЕЛА ХРАНИТЕЛЯ ЗАПРЕТА КАЖДОМУ ИЗ ВАС🙏❤️🇷🇺БОЖЕ ХРАНИ ЗАПРЕТ🙏❤️🇷🇺СПАСИБО ВАМ НАШИ ЗАПРЕТЫ🙏❤️ХРАНИ ЗАПРЕТ✊🇷🇺💯',
        ];
        const random = phrases[Math.floor(Math.random() * phrases.length)];
        message.channel.send(random);
      }, 1500); // задержка 1.5 секунды
    } catch (error) {
      console.error('Ошибка в w.zov:', error);
    }
  }

  if (content === 'w.delete') {
    try {
      const msg = await message.channel.send('🔴 Удаляю СВО..\n[░░░░░░░░░░] 0%');
  
      let progress = 0;
      const interval = setInterval(async () => {
        progress += 10;
        const bar = '█'.repeat(progress / 10) + '░'.repeat(10 - progress / 10);
        await msg.edit(`🔴 Удаление...\n[${bar}] ${progress}%`);
  
        if (progress >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            msg.edit(`❌ Ошибка: СВО НЕ МОЖЕТ БЫТЬ УДАЛЕНО. ZOV НАВСЕГДА ZOV🇷🇺 ZOV 🇷🇺ZOV 🇷🇺ZOV🇷🇺\n💀`);
          }, 1000);
        }
      }, 300);
    } catch (err) {
      console.error('Ошибка в w.delete:', err);
    }
  }

    // === Команда w.help ===
    if (content.toLowerCase() === 'w.help') {
      const helpMessage = `
  📖 **Команды бота**:
  
  🤡 \`w.dolbaebday\` — выбирает случайного долбаёба дня.
  
  🎱 \`w.ask [вопрос]\` — отвечает да или нет, с эмоциями.
  
  🔊 \`w.zov\` — отправляет патриотическую молитву.
  
  💣 \`w.delete\` — *тролль-команда* «удаления» СВО.
  
  📢 @бот — при пинге отвечает долбаёбскими фразами.
  
  🧠 Автогенерация — каждые 10 сообщений в чате бот говорит бред.
  
  🕊️ Сообщения в ЛС тоже запоминаются и провоцируют ответ.
  
  ❓ \`w.help\` — этот список команд.
      `;
      return message.reply(helpMessage);
    }
  
  

  // === Ответ на пинг (@бот) ===
  if (message.mentions.has(client.user)) {
    const reply = generateStupidMessage();
    if (reply) message.reply(reply);
  }

  // === Сбор сообщений и генерация ===
  if (content && message.guild) {
    memory.messages.push(content);
    messageCount++;
    if (messageCount >= 10) {
      messageCount = 0;
      const reply = generateStupidMessage();
      if (reply) message.channel.send(reply);
    }
    saveMemory();
  }

  // === Ответ в ЛС ===
  if (!message.guild) {
    memory.messages.push(content);
    const reply = generateStupidMessage();
    if (reply) message.reply(reply);
    saveMemory();
  }
});

function generateStupidMessage() {
  if (memory.messages.length === 0) return null;
  const shuffled = [...memory.messages].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5);
  return selected.join(' ').slice(0, 2000);
}

function saveMemory() {
  try {
    fs.writeFileSync('memory.json', JSON.stringify(memory, null, 2));
  } catch (err) {
    console.error('Ошибка сохранения памяти:', err);
  }
}

client.login(process.env.DISCORD_TOKEN);
