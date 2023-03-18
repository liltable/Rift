const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const icons = require("../../icons/urls");
const { storage } = require("../../schemas/guild");
const { types } = require("../../types/types");

module.exports = {
  name: "interactionCreate",
  function: "kick",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("kick")) return;
    const cache = client.cache.get(interaction.message.id);
    if (!cache)
      return interaction.reply({
        content: "This button menu has expired.",
        ephemeral: true,
      });
    if (cache !== interaction.user.id)
      return interaction.reply({
        content: "This isn't your button menu.",
        ephemeral: true,
      });
    const { member, guild } = interaction;
    const args = interaction.customId.split(".");
    const target = await guild.members.fetch(args[1]);
    const reason = args[2];

    const memberTimestamp = parseInt(member.user.createdTimestamp / 1000);
    const timestamp = parseInt(interaction.created / 1000);

    await target.kick({ reason: reason });

    const Log = new EmbedBuilder()
      .setColor(Colors.Red)
      .setThumbnail(`${icons.delete}`)
      .setTitle(`${client.user.username} | Logs`)
      .setDescription(
        `> Member kicked.\n> Member: ${target || `\`Failed to fetch.\``} (${
          target.id
        })\n> Account Created: <t:${memberTimestamp}:T> | <t:${memberTimestamp}:R>\n> Staff: ${
          member || `\`Failed to fetch.\``
        } (${
          member.id
        })\n> Reason: ${reason}\n> Date: <t:${timestamp}:T> | <t:${timestamp}:R>`
      );

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({
        iconURL: target.user.avatarURL(),
        name: target.user.username + "#" + target.user.discriminator,
      })
      .setDescription(`> Kicked ${target} for **${reason}**.`);

    await interaction.reply({ embeds: [Reply] });

    const server = await storage.findOne({ guild: guild.id });
    if (!server) {
      const owner = await guild.fetchOwner();
      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(
          `> It seem's that you haven't configured logging for your server **${
            guild.name
          }**. If you would like to, please use the ${"`/config`"} command in your server.`
        );
      if (
        owner.dmChannel?.lastMessage?.embeds[0]?.description ===
        embed.data.description
      ) {
        return;
      } else {
        try {
          owner.send({
            embeds: [embed],
          });
        } catch (err) {
          console.log(
            `Failed to notify owner (${
              owner.user.username + "#" + owner.user.discriminator
            }) of guild (${guild.name}) that they don't have logging enabled.`
          );
        }
      }
    }
    if (
      server.logs.enabled &&
      server.logs.events.includes(types.logs.member || types.logs.staff)
    ) {
      const channel = guild.channels.cache.get(server.logs.channel);
      if (!channel) {
        try {
          const owner = await guild.fetchOwner();
          owner.send({
            embeds: [
              new EmbedBuilder().setDescription(
                `> It seems there has been an error with logging.\n> In the meantime, I've disabled logging and reset the channel for your server (${guild.name}).\n> Please reset this manually or contact support. `
              ),
            ],
          });
          server.logs.enabled = false;
          server.logs.channel = null;
          await server.save();
        } catch (err) {
          console.log(`Failed to log a kick action for guild: ${guild.name}.`);
        }
      } else {
        await channel.send({ embeds: [Log] });
      }
    }

    setTimeout(async () => {
      const msg = await interaction.fetchReply();
      if (msg && msg.deletable) {
        await msg.delete();
      }
    }, ms("10s"));
  },
};
