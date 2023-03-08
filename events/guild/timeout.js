const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const { storage } = require("../../schemas/guild");
const ms = require("ms");

module.exports = {
  name: "interactionCreate",
  function: "timeout",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("timeout")) return;
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
    const args = interaction.customId.split(".");
    const { member, guild } = interaction;
    const target = guild.members.cache.get(args[1]);
    const duration = args[3];
    const reason = args[2];

    const Log = new EmbedBuilder();
    const Reply = new EmbedBuilder();

    await target.disableCommunicationUntil(ms(duration), {
      reason: reason,
    });

    const server = await storage.findOne({ guild: guild.id });
    if (!server) {
      const owner = await guild.fetchOwner({ force: true });
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
        channel.send({ embeds: [Log] });
      }
    }

    await interaction.reply({ embeds: [Reply] });

    setTimeout(async () => {
      const message = await interaction.fetchReply();
      if (message && message.deletable) {
        message.delete();
      }
    }, ms("10s"));
  },
};
