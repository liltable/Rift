const { EmbedBuilder, time } = require("@discordjs/builders");
const { GuildMember, Guild, Colors } = require("discord.js");
const icons = require("../icons/urls");
const { storage } = require("../schemas/guild");

const types = {
  logs: {
    channel: "channel",
    server: "server",
    member: "member",
    roles: "roles",
    staff: "staff",
    message: "message",
  },
  formats: {
    yes: ":white_check_mark:",
    no: ":no_entry_sign:",
  },
};

module.exports = {
  types,
};
