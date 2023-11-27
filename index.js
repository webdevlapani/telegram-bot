require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();
app.use(bodyParser.json());

/**
 * The `init` function sends a request to the Telegram API to set a webhook URL.
 */
const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.post(URI, async (req, res) => {
  console.log(req.body);

  let message = "";
  const channelId = "@mybotesting";
  const chatId = req.body.message.chat.id;
  const text = req.body.message?.text;
  const poll = req.body.message?.poll;
  const photo = req.body.message?.photo;
  const video = req.body.message?.video;

  try {
    if (text) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: channelId,
        text,
      });
      message = "your text message succesfully sended to @mybotesting channel";
    } else if (poll) {
      await axios.post(`${TELEGRAM_API}/sendPoll`, {
        chat_id: channelId,
        question: poll.question,
        options: poll.options.map((item) => item.text),
      });
      message = "your poll succesfully sended to @mybotesting channel";
    } else if (photo) {
      await axios.post(`${TELEGRAM_API}/sendPhoto`, {
        chat_id: channelId,
        photo: photo[0].file_id,
      });
      message = "your photo succesfully sended to @mybotesting channel";
    } else if (video) {
      await axios.post(`${TELEGRAM_API}/sendVideo`, {
        chat_id: channelId,
        video: video.file_id,
      });
      message = "your video succesfully sended to @mybotesting channel";
    }
  } catch (err) {
    console.log("🚀 ~ err:", err);
    message =
      "something went wrong, we are not send your message to any channel";
  }

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: message,
  });

  return res.send();
});

app.listen(process.env.PORT || 5000, async () => {
  console.log("🚀 app running on port", process.env.PORT || 5000);
  await init();
});
