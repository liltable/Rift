const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  Client,
} = require("discord.js");
const icons = require("../../icons/urls");
const { storage } = require("../../schemas/guild");

module.exports = {
  name: "ban",
  description: "Bans a guild member.",
  permission: "BanMembers",
  options: [
    {
      name: "target",
      description: "Select a member.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Input a reason.",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "messages",
      description: "Delete the target's messages?",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "After 7 days",
          value: "7d",
        },
        {
          name: "After 30 days",
          value: "30d",
        },
      ],
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member, options } = interaction;
    const target = guild.members.cache.get(
      options.getMentionable("target", true).id
    );
    const reason = options.getString("reason") || "No reason provided.";
    const delMsgs = options.getString("messages") || "30d";

    const Timestamp = parseInt(interaction.createdTimestamp / 1000);

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setThumbnail(`${target.user.avatarURL()}`)
      .setDescription(
        `> :no_entry_sign: Banned ${
          target || `\`Unknown\``
        }\n> Reason: ${reason}`
      );

    const Log = new EmbedBuilder()
      .setColor(Colors.Red)
      .setThumbnail(`${icons.delete}`)
      .setTitle(`${client.user.username} | Logs`)
      .setAuthor({
        iconURL: target.user.avatarURL(),
        name: target.user.username + "#" + target.user.discriminator,
      })
      .setDescription(
        `> Member banned.\n> Member: ${target || "`Failed to fetch.`"} (${
          target.id
        })\n> Reason: ${reason}\n> Staff: ${
          member || `\`Failed to fetch.\``
        } (${member.id})\n> Date: <t:${Timestamp}:T> | <t:${Timestamp}:R>`
      );

    if (!target.bannable) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> :no_entry_sign: Missing permissions: \`${this.permission}\``
            ),
        ],
        ephemeral: true,
      });

      target.ban({
        deleteMessageSeconds: ms(delMsgs) * 1000,
        reason: reason,
      });

      interaction.reply({ embeds: [Reply] });
      let msg = await interaction.fetchReply();

      setTimeout(() => {
        if (msg.deletable) {
          msg.delete();
        }
      }, ms("10s"));

      const docs = await storage.findOne({ guild: guild.id });
      if (!docs) return;
      if (!docs.logs.enabled) return;
      else {
        const channel = guild.channels.cache.get(docs.logs.channel);
        if (!channel) {
          docs.logs.enabled = false;
          docs.logs.channel = undefined;
          await docs.save();
          try {
            client.users.cache.get(guild.ownerId).send({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Red)
                  .setDescription(
                    `> It seems like the logs channel set for your server (${guild.name}) isn't correct.\n> Please reset it as soon as possible in order to prevent future errors.\n> In the meantime, logging has been disabled for your server.`
                  ),
              ],
            });
          } catch (err) {
            return;
          }
        }
        channel.send({ embeds: [Log] });
      }
    }
  },
};
