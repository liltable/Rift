const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const icons = require("../../icons/urls");
const { storage } = require("../../schemas/guild");
const { logs } = require("../../types/logs");

module.exports = {
  name: "interactionCreate",
  function: "ban",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("ban")) return;
    const cache = client.cache.get(interaction.message.id);
    if (cache !== interaction.user.id)
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            `> :no_entry_sign: This isn't your button menu.`
          ),
        ],
        ephemeral: true,
      });
    const { guild, member } = interaction;
    const args = interaction.customId.split(".");
    var reason = args[2];
    var delMsgs = args[3];
    var target = await guild.members.fetch(args[1]);
    await target.ban({
      reason: reason,
      deleteMessageSeconds: delMsgs,
    });

    await logs.ban(
      member,
      target,
      reason,
      guild,
      parseInt(interaction.createdTimestamp / 1000)
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
          member.user || `\`Failed to fetch.\``
        } (${member.user.id})\n> Date: <t:${Timestamp}:f> | <t:${Timestamp}:R>`
      );
    const Timestamp = parseInt(interaction.createdTimestamp / 1000);

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setThumbnail(`${target.user.avatarURL()}`)
      .setDescription(
        `> :no_entry_sign: Banned ${
          target || `\`Unknown\``
        }\n> Reason: ${reason}\n> Date: <t:${Timestamp}:f> | <t:${Timestamp}:R>`
      );

    interaction.reply({ embeds: [Reply] });

    const server = await storage.findOne({ guild: guild.id });
    if (
      server.logs.enabled &&
      server.logs.events.includes(Types.Logs.Staff || Types.Logs.Member) &&
      server.logs.channel
    ) {
      try {
        guild.channels.cache.get(server.logs.channel).send({ embeds: [Log] });
      } catch (err) {
        try {
          (await guild.fetchOwner()).send({
            embeds: [
              new EmbedBuilder().setDescription(
                `> It seems like there's an error with the logging channel that you set up for your server: **${guild.name}**.\n> In the meantime, I've disabled logging and reset the logging channel.`
              ),
            ],
          });
        } catch (err) {
          console.log(
            `Guild owner ${(await guild.fetchOwner()).user.username} (${
              (await guild.fetchOwner()).id
            }) has DM's disabled. Failed to notify them of changes within their server regarding logging.`
          );
        }

        server.logs.enabled = false;
        server.logs.channel = null;
        await server.save();
      }
    }
    setTimeout(async () => {
      const msg = await interaction.fetchReply();
      if (msg.deletable) {
        msg.delete();
      }
    }, ms("10s"));
  },
};
