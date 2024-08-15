const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment-timezone');

// Ganti dengan token API bot Anda
const token = '7523215904:AAFQ__RTZThrS42p_SxHohjqyxiEeYM-bRA';
const bot = new TelegramBot(token, { polling: true });

// Set timezone wilayah Tangerang
const timezone = 'Asia/Jakarta';
const city = 'Tangerang';

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Assalamualaikum! Saya adalah bot pengingat waktu adzan. Ketik /adzan untuk mendapatkan waktu adzan hari ini.');
});

bot.onText(/\/adzan/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Ambil waktu sholat dari API
    const today = moment().tz(timezone).format('YYYY-MM-DD');
    const response = await axios.get(`https://api.pray.zone/v2/times/day.json?city=${city}&date=${today}`);

    const times = response.data.results.datetime[0].times;
    const adzanTimes = `
    Waktu Adzan di ${city} pada ${today}:
    - Subuh: ${times.Fajr}
    - Dzuhur: ${times.Dhuhr}
    - Ashar: ${times.Asr}
    - Maghrib: ${times.Maghrib}
    - Isya: ${times.Isha}
    `;

    bot.sendMessage(chatId, adzanTimes);
  } catch (error) {
    bot.sendMessage(chatId, 'Maaf, terjadi kesalahan dalam mengambil waktu adzan.');
  }
});

module.exports = (req, res) => {
  res.status(200).send('Adzan Bot is running');
};
