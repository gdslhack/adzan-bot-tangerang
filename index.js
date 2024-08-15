const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment-timezone');

const token = '7523215904:AAFQ__RTZThrS42p_SxHohjqyxiEeYM-bRA';
const bot = new TelegramBot(token, { polling: true });

const timezone = 'Asia/Jakarta';
const city = 'Tangerang';

bot.onText(/\/adzan/, async (msg) => {
  const chatId = msg.chat.id;
  console.log('Received /adzan command from chatId:', chatId);

  try {
    const city = 'Tangerang';
    const today = moment().format('YYYY-MM-DD');
    console.log('Fetching adzan times for date:', today);

    const response = await axios.get(`https://api.adlan.com/v1/adzan`, {
      params: {
        city: city,
        date: today
      }
    });

    console.log('Received response:', response.data);

    const times = response.data.results.times;
    const adzanTimes = `
    Waktu Adzan di ${city} pada ${today}:
    - Subuh: ${times.Fajr}
    - Dzuhur: ${times.Dhuhr}
    - Ashar: ${times.Asr}
    - Maghrib: ${times.Maghrib}
    - Isya: ${times.Isha}
    `;

    console.log('Sending adzan times to chatId:', chatId);
    await bot.sendMessage(chatId, adzanTimes);
  } catch (error) {
    console.error('Error fetching adzan times:', error.message);
    bot.sendMessage(chatId, 'Maaf, terjadi kesalahan dalam mengambil waktu adzan.');
  }
});

module.exports = (req, res) => {
  res.status(200).send('Adzan Bot is running');
};
