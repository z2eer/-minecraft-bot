const TelegramBot = require('node-telegram-bot-api');
const mineflayer = require('mineflayer');

// استبدل 'YOUR_TELEGRAM_BOT_TOKEN' بتوكن بوتك الحقيقي من BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

let mcBot = null;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "أهلاً بك في بوت إدارة سيرفر ماينكرافت!\n/join - لدخول البوت وإبقاء السيرفر شغالاً\n/leave - لخروج البوت");
});

bot.onText(/\/join/, (msg) => {
  const chatId = msg.chat.id;
  
  if (mcBot) {
    bot.sendMessage(chatId, "البوت موجود داخل السيرفر بالفعل!");
    return;
  }

  bot.sendMessage(chatId, "جاري إدخال البوت إلى سيرفر Aternos...");

  mcBot = mineflayer.createBot({
    host: 'اسم_سيرفرك.aternos.me', // حط رابط سيرفرك هنا
    port: 12345,                  // البورت الخاص بسيرفرك
    username: 'AternosGuard'      // اسم البوت داخل اللعبة
  });

  mcBot.on('spawn', () => {
    bot.sendMessage(chatId, "✅ تم دخول البوت بنجاح وبقي السيرفر مفتوحاً!");
    
    // حركة لمنع الطرد بسبب الخمول كل دقيقة
    setInterval(() => {
      if (mcBot) {
        mcBot.setControlState('jump', true);
        setTimeout(() => mcBot.setControlState('jump', false), 500);
      }
    }, 60000);
  });

  mcBot.on('end', () => {
    bot.sendMessage(chatId, "⚠️ تم فصل البوت من السيرفر.");
    mcBot = null;
  });
});

bot.onText(/\/leave/, (msg) => {
  const chatId = msg.chat.id;
  if (mcBot) {
    mcBot.quit();
    mcBot = null;
    bot.sendMessage(chatId, "🛑 تم إخراج البوت.");
  } else {
    bot.sendMessage(chatId, "البوت ليس داخل السيرفر أصلاً.");
  }
});
