const { GuildMember, Client } = require("discord.js");
const { storage } = require("../../schemas/guild");

module.exports = {
  name: "guildMemberAdd",
  function: "welcome",
  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const { guild } = member;
    const server = await storage.findOne({ guild: guild.id });
    if (!server.greeting.enabled) return;
    const { style } = server.greeting;
    // TODO: Finish greetings.
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
