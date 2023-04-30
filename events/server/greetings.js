const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { storage } = require("../../schemas/guild");
const { icons } = require("../../icons/urls");
const { types } = require("../../types/types");

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

    let GreetingStyle = null;
    if (server.greeting.style === "dm") {
      GreetingStyle = "by **DM**";
    } else {
      GreetingStyle = `by **server channel**\n> Channel: ${`<#${server.greeting.channel}>`.replace(
        "<#null>",
        "None set"
      )}`;
    }

    const type = args[1];
    switch (type) {
      case "toggle":
        {
          server.logs.enabled = server.logs.enabled ? false : true;
          await server.save();

          await interaction.reply({
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
            ephemeral: true,
          });

          if (interaction.message.editable) {
            await interaction.message.edit({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Grey)
                  .setThumbnail(icons.greetingsMenu)
                  .setTitle("Rift | Greetings")
                  .setAuthor({
                    name:
                      interaction.user.username +
                      "#" +
                      interaction.user.discriminator,
                    iconURL: interaction.user.avatarURL(),
                  })
                  .setDescription(
                    `Fairly simple.\nConfigure the welcome/goodbye messages for this guild.\nConfigure the join / leave staff logs for this guild.\n\n> Greetings: ${
                      server.greeting.enabled
                        ? types.formats.yes
                        : types.formats.no
                    }\n> Type: ${GreetingStyle}.`
                  ),
              ],
              components: [
                new ActionRowBuilder().setComponents(
                  new ButtonBuilder()
                    .setLabel(server.greeting.enabled ? "Disable" : "Enable")
                    .setStyle(
                      server.greeting.enabled
                        ? ButtonStyle.Danger
                        : ButtonStyle.Success
                    )
                    .setCustomId(`greetings.toggle.${interaction.guild.id}`),
                  new ButtonBuilder()
                    .setLabel("Switch Greeting Style")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`greetings.style.${interaction.guild.id}`),
                  new ButtonBuilder()
                    .setLabel("Set Greeting Channel")
                    .setCustomId(`greetings.channel.${interaction.user.id}`)
                    .setDisabled(server.greeting.style === "dm" ? true : false)
                    .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                    .setCustomId("exit")
                    .setLabel("Exit")
                    .setStyle(ButtonStyle.Danger)
                ),
              ],
            });
          }

          return client.cache.set(
            (await interaction.fetchReply()).id,
            interaction.user.id
          );
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
            ephemeral: true,
          });

          if (interaction.message.editable) {
            await interaction.message.edit({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Grey)
                  .setThumbnail(icons.greetingsMenu)
                  .setTitle("Rift | Greetings")
                  .setAuthor({
                    name:
                      interaction.user.username +
                      "#" +
                      interaction.user.discriminator,
                    iconURL: interaction.user.avatarURL(),
                  })
                  .setDescription(
                    `Fairly simple.\nConfigure the welcome/goodbye messages for this guild.\nConfigure the join / leave staff logs for this guild.\n\n> Greetings: ${
                      server.greeting.enabled
                        ? types.formats.yes
                        : types.formats.no
                    }\n> Type: ${GreetingStyle}.`
                  ),
              ],
              components: [
                new ActionRowBuilder().setComponents(
                  new ButtonBuilder()
                    .setLabel(server.greeting.enabled ? "Disable" : "Enable")
                    .setStyle(
                      server.greeting.enabled
                        ? ButtonStyle.Danger
                        : ButtonStyle.Success
                    )
                    .setCustomId(`greetings.toggle.${interaction.guild.id}`),
                  new ButtonBuilder()
                    .setLabel("Switch Greeting Style")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`greetings.style.${interaction.guild.id}`),
                  new ButtonBuilder()
                    .setLabel("Set Greeting Channel")
                    .setCustomId(`greetings.channel.${interaction.user.id}`)
                    .setDisabled(server.greeting.style === "dm" ? true : false)
                    .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                    .setCustomId("exit")
                    .setLabel("Exit")
                    .setStyle(ButtonStyle.Danger)
                ),
              ],
            });
          }

          return client.cache.set(
            (await interaction.fetchReply()).id,
            interaction.user.id
          );
        }
        break;
    }
  },
};
