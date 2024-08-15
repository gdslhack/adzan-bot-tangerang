const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment-timezone');

// Ganti dengan token bot Telegram Anda
const token = '7523215904:AAFQ__RTZThrS42p_SxHohjqyxiEeYM-bRA'; // Ganti dengan token bot Telegram Anda
const bot = new TelegramBot(token, { polling: false }); // Polling harus dinonaktifkan saat menggunakan webhook

// Inisialisasi server Express
const app = express();
app.use(bodyParser.json());

// Endpoint untuk webhook
app.post('/webhook', async (req, res) => {
  const update = req.body;
  
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    
    if (text === '/adzan') {
      console.log('Received /adzan command from chatId:', chatId);

      try {
        const city = 'Tangerang';  // Ganti sesuai kebutuhan
        const country = 'ID';  // Ganti sesuai kebutuhan
        const today = moment().format('YYYY-MM-DD');
        console.log('Fetching adzan times for date:', today);

        const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
          params: {
            city: city,
            country: country,
            method: 2 // ISNA method
          }
        });

        console.log('Received response:', response.data);

        if (response.data && response.data.data && response.data.data.timings) {
          const times = response.data.data.timings;
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
        } else {
          console.error('Invalid response data:', response.data);
          bot.sendMessage(chatId, 'Maaf, data waktu adzan tidak tersedia.');
        }
      } catch (error) {
        console.error('Error fetching adzan times:', error.message);
        bot.sendMessage(chatId, 'Maaf, terjadi kesalahan dalam mengambil waktu adzan.');
      }
    }
  }
  
  res.sendStatus(200);
});

// Mulai server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Mengatur webhook untuk bot Telegram
const setWebhook = async () => {
  const url = 'https://adzan-bot-tangerang.vercel.app/webhook'; // Ganti dengan URL webhook Anda
  try {
    await bot.setWebHook(url);
    console.log('Webhook set successfully');
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
};

// Panggil fungsi setWebhook ketika aplikasi dimulai
setWebhook();
