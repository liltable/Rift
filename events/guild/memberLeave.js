const { GuildMember, Client } = require("discord.js");
const { storage } = require("../../schemas/guild");

module.exports = {
  name: "guildMemberRemove",
  function: "goodbye",
  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    return;

    //TODO: Finish this as well.
    // const { guild } = member;
    // const server = await storage.findOne({ guild: guild.id });
    // if (!server.greeting.enabled) return;
    // const { style } = server.greeting;

    // switch (style) {
    //   case "dm":
    //     {
    //     }
    //     break;
    //   case "channel":
    //     {
    //     }
    //     break;
    // }
  },
};
