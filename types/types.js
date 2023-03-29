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
  logs: {
    /**
     *
     * @param {GuildMember} staff
     * @param {GuildMember} target
     * @param {String} reason
     * @param {Guild} guild
     * @param {Number} timestamp
     */
    ban: async function (staff, target, reason, guild, timestamp) {
      const server = await storage.findOne({ guild: guild.id });
      if (!server.logs.enabled) return;
      if (!guild.channels.cache.get(server.logs.channel)) return;
      const Embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`Rift | Logs`)
        .setThumbnail(icons.delete)
        .setAuthor({
          name: target.user.username + "#" + target.user.discriminator,
          iconURL: target.user.avatarURL(),
        })
        .setDescription(
          `> Guild member banned! ${target}\n\n📁 Target:\n Full Username: ${
            target.user.username + "#" + target.user.discriminator
          }\n ID: ${
            target.user.id
          }\n Reason: ${reason}\nDate Banned: <t:${timestamp}:f> | <t:${timestamp}:R>\n Staff: ${staff}`
        );

      try {
        guild.channels.cache.get(server.logs.channel).send({ embeds: [Embed] });
      } catch (err) {
        console.log(
          `Failed to log the ban of ${
            target.user.username + "#" + target.user.discriminator
          } in guild ${guild.name}.`
        );
      }
    },
    /**
     *
     * @param {GuildMember} target
     * @param {GuildMember} staff
     * @param {String} reason
     * @param {Guild} guild
     * @param {Number} timestamp
     */
    kick: async function (target, staff, reason, guild, timestamp) {
      const server = await storage.findOne({ guild: guild.id });
      if (!server.logs.enabled) return;
      if (!guild.channels.cache.get(server.logs.channel)) return;
      const Embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`Rift | Logs`)
        .setThumbnail(icons.delete)
        .setAuthor({
          name: target.user.username + "#" + target.user.discriminator,
          iconURL: target.user.avatarURL(),
        })
        .setDescription(
          `> Guild member kicked! ${target}\n\n📁 Target:\n Full Username: ${
            target.user.username + "#" + target.user.discriminator
          }\n ID: ${
            target.user.id
          }\n Reason: ${reason}\nDate Kicked: <t:${timestamp}:f> | <t:${timestamp}:R>\n Staff: ${staff}`
        );

      try {
        guild.channels.cache.get(server.logs.channel).send({ embeds: [Embed] });
      } catch (err) {
        console.log(
          `Failed to log the kick of ${
            target.user.username + "#" + target.user.discriminator
          } in guild ${guild.name}.`
        );
      }
    },
    /**
     *
     * @param {GuildMember} target
     * @param {GuildMember} staff
     * @param {String} reason
     * @param {Guild} guild
     * @param {Number} timestamp
     * @param {String} duration
     */
    timeout: async function (
      target,
      staff,
      reason,
      guild,
      timestamp,
      duration
    ) {
      const server = await storage.findOne({ guild: guild.id });
      if (!server.logs.enabled) return;
      if (!guild.channels.cache.get(server.logs.channel)) return;
      const Embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`Rift | Logs`)
        .setThumbnail(icons.delete)
        .setAuthor({
          name: target.user.username + "#" + target.user.discriminator,
          iconURL: target.user.avatarURL(),
        })
        .setDescription(
          `> Guild member muted! ${target}\n\n📁 Target:\n Full Username: ${
            target.user.username + "#" + target.user.discriminator
          }\n ID: ${
            target.user.id
          }\n Reason: ${reason}\nDate Muted: <t:${timestamp}:f> | <t:${timestamp}:R>\n Staff: ${staff}\n Duration: ${duration}`
        );

      try {
        guild.channels.cache.get(server.logs.channel).send({ embeds: [Embed] });
      } catch (err) {
        console.log(
          `Failed to log the kick of ${
            target.user.username + "#" + target.user.discriminator
          } in guild ${guild.name}.`
        );
      }
    },
  },
};

module.exports = {
  types,
};
