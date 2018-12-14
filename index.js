"use strict";
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const request = require("request");
const path = require("path");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.send("HI i am a chatbot");
});
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === "HafsBytes") {
    res.send(req.query["hub.challenge"]);
  }
  res.send("wrong token");
});
app.post("/webhook", (req, res) => {
  let messaging_events = req.body.entry[0].messaging_events;
  for (let i = 0; i < messaging_events.length; i++) {
    let event = messaging_events[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      sendText(sender, "Text echo: " + text.substring(0, 100));
    }
  }
  res.sendStatus(200);
});
let token = process.env["token"];
function sendText(sender, text) {
  let messageData = { text: text };
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token, token },
      method: "POST",
      json: {
        receipt: { id: sender },
        message: messageData
      }
    },
    function(error, response, body) {
      if (error) {
        console.log("sending error");
      } else if (response.body.error) {
        console.log("response body error");
      }
    }
  );
}

const port = process.env.PORT || "5000";
app.set("port", port);

app.listen(port, () => console.log(`Running on localhost:${port}`));
