const Discord = require("discord.js");
const Database = require("mongoose");
const { load } = require("./functions/load.js");

const client = new Discord.Client({ intents: 32767 });
client.config = require("./config.json");
client.commands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.events = new Discord.Collection();
client.cache = new Discord.Collection();
Database.set("strictQuery", true);
Database.connect(client.config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Successfully connected to cloud storage.`);
});

client.login(client.config.token).then(async () => {
  if (client.application) {
    load.commands(client);
    load.events(client);
    load.buttons(client);
  }
});
module.exports = client;
