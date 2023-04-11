const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { storage } = require("../../schemas/guild");
const { icons } = require("../../icons/urls");

module.exports = {
  name: "interactionCreate",
  function: "greetings",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("greetings")) return;
    const cache = await client.cache.get(interaction.message.id);
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

    const args = interaction.customId.split(".");
    const guild = client.guilds.cache.get(args[2]);
    const server = await storage.findOne({ guild: guild.id });

    const type = args[1];
    switch (type) {
      case "toggle":
        {
          server.logs.enabled = server.logs.enabled ? false : true;
          await server.save();

          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(server.logs.enabled ? Colors.Green : Colors.Red)
                .setAuthor({
                  iconURL: interaction.user.avatarURL(),
                  name:
                    interaction.user.username +
                    "#" +
                    interaction.user.discriminator,
                })
                .setTitle("Rift | Notice")
                .setThumbnail(icons.edit)
                .setDescription(
                  `> ${
                    server.logs.enabled ? "Enabled" : "Disabled"
                  } greeting for this server.`
                ),
            ],
          });
        }
        break;
      case "style":
        {
          if (server.greeting.style === "dm") {
            server.greeting.style = "channel";
            await server.save();
          } else {
            server.greeting.style = "dm";
            await server.save();
          }

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Green)
                .setThumbnail(icons.create)
                .setAuthor({
                  name:
                    interaction.user.username +
                    "#" +
                    interaction.user.discriminator,
                  iconURL: interaction.user.avatarURL(),
                })
                .setTitle("Rift | Notice")
                .setDescription(
                  `> Successfully set the server's greeting style to: **${server.greeting.style
                    .replace("dm", "Greet via DM")
                    .replace("channel", "Greet via server channel")}**.`
                ),
            ],
          });
        }
        break;
    }
  },
};
