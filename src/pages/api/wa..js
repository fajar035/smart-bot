/* eslint-disable import/no-anonymous-default-export */
const { Configuration, OpenAIApi } = require("openai");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key nya belum ada ya, tolong baca documentasi nya ya",
      },
    });
    return;
  }

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready ...");
    res.status(200).json({
      status: "Connected",
      message: "Client is ready",
    });
  });

  client.on("message", (message) => {
    const { body } = message;
    if (body === "p" || body === "." || body === "." || body === "fajar") {
      return client.sendMessage(
        message.from,
        "Hallo, aku robot yang dapat membantu kamu untuk mencari apapun. coba tanyakan aku 😊"
      );
    }
    const openAiFetch = async (body) => {
      try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: body,
          temperature: 0.1,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 256,
        });

        const data = completion.data.choices[0].text.trim();
        client.sendMessage(message.from, data);
      } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: "An error occurred during your request.",
            },
          });
        }
      }
    };

    openAiFetch(body);
  });

  client.initialize();
}
