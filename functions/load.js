const { loadButtons } = require("./loadButtons");
const { loadCmds } = require("./loadCmds");
const { loadEvents } = require("./loadEvents");
const { loadFiles } = require("./loadFiles");

const load = {
  events: loadEvents,
  commands: loadCmds,
  buttons: loadButtons,
};

module.exports = { load };
