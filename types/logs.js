const {
  Role,
  GuildMember,
  Colors,
  Attachment,
  Guild,
  EmbedBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { icons } = require("../icons/urls");
const { storage } = require("../schemas/guild");

const logs = {
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
        }\n ID: ${target.user.id}\n Account Created: <t:${parseInt(
          target.user.createdTimestamp / 1000
        )}:f> | <t:${parseInt(
          target.user.createdTimestamp / 1000
        )}:R>\n Reason: ${reason}\nDate Banned: <t:${timestamp}:f> | <t:${timestamp}:R>\n Staff: ${staff}`
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
        }\n ID: ${target.user.id}\n Account Created: <t:${parseInt(
          target.user.createdTimestamp / 1000
        )}:f> | <t:${parseInt(
          target.user.createdTimestamp / 1000
        )}:R> \nReason: ${reason}\nDate Kicked: <t:${timestamp}:f> | <t:${timestamp}:R>\n Staff: ${staff}`
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
  timeout: async function (target, staff, reason, guild, timestamp, duration) {
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
        `> Guild member muted! ${target}\n\n📁4 Target:\n Full Username: ${
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
  /**
   *
   * @param {Role} role
   * @param {GuildMember} member
   * @param {String} reason
   * @param {Number} timestamp
   * @param {Boolean} nowHas
   * @param {GuildMember} staff
   */
  role: async function (role, member, reason, timestamp, nowHas, staff) {
    const server = await storage.findOne({ guild: guild.id });
    if (!server.logs.enabled) return;
    if (!guild.channels.cache.get(server.logs.channel)) return;
    const Embed = new EmbedBuilder()
      .setColor(nowHas ? Colors.Green : Colors.Red)
      .setTitle(`Rift | Logs`)
      .setThumbnail(nowHas ? icons.create : icons.delete)
      .setAuthor({
        name: target.user.username + "#" + target.user.discriminator,
        iconURL: target.user.avatarURL(),
      })
      .setDescription(
        `Guild member role ${
          nowHas ? "added" : "removed"
        }! ${member}\n> Role: ${role || `\`Failed to fetch\``}\n> ID: ${
          role.id ||
          `\`-\`\n> Date: <t:${timestamp}:f> | <t:${timestamp}:R>\n> Reason: ${reason}\n> Staff: ${staff}`
        }`
      );

    try {
      guild.channels.cache.get(server.logs.channel).send({ embeds: [Embed] });
    } catch (err) {
      console.log(
        `Failed to log the role ${nowHas ? "addition" : "removal"} of ${
          target.user.username + "#" + target.user.discriminator
        } in guild ${guild.name}.\n Role: ${role.name}`
      );
    }
  },
  /**
   *
   * @param {import("discord.js").GuildTextBasedChannel} channel
   * @param {import("discord.js").GuildTextBasedChannel} newChannel
   * @param {String} reason
   * @param {GuildMember} staff
   * @param {Number} timestamp
   * @param {Attachment} attachment
   */
  nuke: async function (
    channel,
    newChannel,
    reason,
    staff,
    timestamp,
    attachment
  ) {
    const server = await storage.findOne({ guild: staff.guild.id });
    if (!server.logs.enabled) return;
    const { guild } = staff;
    const Embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setThumbnail(`${icons.delete}`)
      .setTitle(`Rift | Logs`)
      .setDescription(
        `> Channel nuked! ${newChannel}\n\n> Old Channel ID: ${
          channel.id
        }\n> Channel ID: ${
          newChannel.id
        }\n> Reason: ${reason}\n> Staff: ${staff}\n> ID: ${
          staff.id
        }\n> Account Created: <t:${parseInt(
          staff.user.createdTimestamp / 1000
        )}:f> | <t:${parseInt(
          staff.user.createdTimestamp / 1000
        )}:R>\n> Date Nuked: <t:${timestamp}:f> | <t:${timestamp}:R>\n\n> *Nuking a channel is dangerous. Important messages could be lost. Therefore, an HTML document containing all of the messages has been saved below. If this message is deleted, this transcript will be lost forever.*`
      );

    try {
      guild.channels.cache
        .get(server.logs.channel)
        .send({ embeds: [Embed], attachment: attachment });
    } catch (err) {
      console.log(
        `Failed to log the nuke of channel ${newChannel.name} in guild ${guild.name}.`
      );
    }
  },
};

module.exports = {
  logs,
};
