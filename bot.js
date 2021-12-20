require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = process.env.Token_Telegram;
const apiSpeach = process.env.Token_Yandex;
const bot = new TelegramBot(token, { polling: true });


bot.on('voice', function (msg) {
  const stream = bot.getFileStream(msg.voice.file_id)


  let chunks = []
  stream.on('data', chunk => chunks.push(chunk))

  stream.on('end', async () => {
    const axiosCofig = {
      method: 'POST',
      url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
      headers: {
        Authorization: `Api-Key ${apiSpeach}`
      },
      data: Buffer.concat(chunks),
    }
    const response = await axios(axiosCofig)
    const { result } = await response.data;
    console.log(response)
    const idAudio = msg.chat.id;
    // console.log(response.data)
    try {
      bot.sendMessage(
        idAudio,
        `${msg.from.first_name} ${msg.from.last_name} говорит:\n${result}`
        // `${result}`
      );
      // console.log(msg)

      // console.log(`${msg.first_name} ${msg.last_name} говорит:\n${result}`)
    } catch (err) {
      bot.sendMessage(idAudio, 'Не распознала голос, возможно слишком шумно вокруг вас')
    }

  })
})

  // bot.sendMessage(chatId, 'Received your message');

