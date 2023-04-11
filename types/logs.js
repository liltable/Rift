const {
  Role,
  GuildMember,
  Colors,
  Attachment,
  Guild,
  EmbedBuilder,
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
      .setThumbnail(icons.leave)
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
      .setThumbnail(icons.leave)
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
      .setThumbnail(icons.leave)
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
      .setThumbnail(nowHas ? icons.roleAdd : icons.roleRemove)
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
      .setThumbnail(`${icons.nuke}`)
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
        )}:R>\n> Date Nuked: <t:${timestamp}:f> | <t:${timestamp}:R>\n\n> *Nuking a channel is dangerous. Important messages could be lost. Therefore, an HTML document containing all of the messages has been saved above. If this message is deleted, this transcript will be lost forever.*`
      );

    try {
      guild.channels.cache
        .get(server.logs.channel)
        .send({ embeds: [Embed], files: [attachment] });
    } catch (err) {
      console.log(
        `Failed to log the nuke of channel ${newChannel.name} in guild ${guild.name}.`
      );
    }
  },
  /**
   *
   * @param {Attachment} attachment
   * @param {String} reason
   * @param {GuildMember} member
   * @param {import("discord.js").TextBasedChannel} channel
   * @param {Number} timestamp
   * @param {Number} amount
   */
  save: async function (
    attachment,
    reason,
    member,
    channel,
    timestamp,
    amount
  ) {
    const server = await storage.findOne({ guild: member.guild.id });
    if (!server.logs.enabled) return;

    const Embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("Rift | Logs")
      .setAuthor({
        name: member.user.username + "#" + member.user.discriminator,
        iconURL: member.user.avatarURL(),
      })
      .setThumbnail(icons.create)
      .setDescription(
        `Channel transcript saved! ${channel}\n\n> Channel: ${channel} (${
          channel.id
        })\n> Amount: ${amount} message(s)\n> Reason: ${reason}\n> Date Saved: <t:${timestamp}:f> | <t:${timestamp}:R>\n> Member: ${member} (${
          member.user.id
        })\n> Date Joined: <t:${parseInt(
          member.user.createdTimestamp / 1000
        )}:f> | <t:${parseInt(
          member.user.createdTimestamp / 1000
        )}:R>\n\n*Since this transcript may contain sensitive messages, we saved a copy in the logs. If this message is deleted, the transcript is lost forever.*`
      );

    try {
      member.guild.channels.cache
        .get(server.logs.channel)
        .send({ embeds: [Embed], files: [Attachment] });
    } catch (err) {
      console.log(
        `Failed to log the save of channel ${channel.name} by guild member ${
          member.user.username + "#" + member.user.discriminator
        } in guild ${member.guild.name}.`
      );
    }
  },
};

module.exports = {
  logs,
};
