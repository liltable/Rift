const { loadButtons } = require("./loadButtons");
const { loadCmds } = require("./loadCmds");
const { loadEvents } = require("./loadEvents");
const { loadFiles } = require("./loadFiles");
const { loadGuilds } = require("./loadGuilds");

const load = {
  events: loadEvents,
  commands: loadCmds,
  buttons: loadButtons,
  guilds: loadGuilds,
};

module.exports = { load };
