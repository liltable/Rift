const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { storage } = require("../../schemas/guild");
const { icons } = require("../../icons/urls");
const { types } = require("../../types/types");
const ms = require("ms");

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
    const guild = client.guilds.cache.get(args[2]) || interaction.guild;
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
          const Now = server.greeting.enabled;
          server.greeting.enabled = Now ? false : true;
          await server.save();
          console.log(server.greeting.enabled.toString());

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
      case "channel":
        {
          const Modal = new ModalBuilder()
            .setCustomId(`greetings.modal`)
            .setTitle("Rift | Set Greetings Channel")
            .setComponents(
              new ActionRowBuilder().setComponents(
                new TextInputBuilder()
                  .setCustomId(`greetings.modal.channel`)
                  .setLabel("Input the channel ID:")
                  .setPlaceholder("Channel ID's are 16-20 digits in length.")
                  .setMinLength(16)
                  .setMaxLength(20)
                  .setRequired(true)
                  .setStyle(TextInputStyle.Short)
              )
            );

          await interaction.showModal(Modal);

          await interaction
            .awaitModalSubmit({
              filter: (interaction) =>
                interaction.isModalSubmit() &&
                interaction.customId === "greetings.modal",
              time: ms("15s"),
            })
            .then(async (int) => {
              const ID = int.fields.getTextInputValue(
                "greetings.modal.channel"
              );

              const Channel = int.guild.channels.cache.get(ID);

              if (!Channel)
                return int.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(Colors.Red)
                      .setDescription(
                        `> :no_entry_sign: Unknown/Lost channel.`
                      ),
                  ],
                  ephemeral: true,
                });
              else {
                server.greeting.channel = ID;
                await server.save();
                return int.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(Colors.Green)
                      .setTitle("Rift | Greetings")
                      .setAuthor({
                        iconURL: int.user.avatarURL(),
                        name: int.user.username + "#" + int.user.discriminator,
                      })
                      .setThumbnail(icons.create)
                      .setDescription(
                        `> :white_check_mark: Successfully set this guild's greeting channel to ${Channel} (${ID}).`
                      ),
                  ],
                  components: [
                    new ActionRowBuilder().setComponents(
                      new ButtonBuilder()
                        .setCustomId(`greetings.message`)
                        .setLabel("Set Greeting Message")
                        .setStyle(ButtonStyle.Secondary),
                      new ButtonBuilder()
                        .setCustomId("exit")
                        .setLabel("Exit")
                        .setStyle(ButtonStyle.Danger)
                    ),
                  ],
                });
              }
            });
        }
        break;
      case "message":
        {
          const Modal = new ModalBuilder()
            .setTitle("Rift | Greetings")
            .setCustomId("greetings.message.modal")
            .setComponents(
              new ActionRowBuilder().setComponents(
                new TextInputBuilder()
                  .setCustomId("greetings.message.modal.content")
                  .setRequired(true)
                  .setStyle(TextInputStyle.Paragraph)
                  .setLabel("Message:")
                  .setPlaceholder("Input the greeting message.")
              )
            );

          interaction.showModal(Modal);

          interaction
            .awaitModalSubmit({
              filter: (interaction) =>
                interaction.customId === "greetings.message.modal",
              time: ms("15s"),
            })
            .then(async (int) => {
              const Message = int.fields.getTextInputValue(
                "greetings.message.modal.content"
              );

              server.greeting.message = Message;
              await server.save();

              return int.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Rift | Greetings")
                    .setAuthor({
                      name: int.user.username + "#" + int.user.discriminator,
                      iconURL: int.user.avatarURL(),
                    })
                    .setThumbnail(icons.edit)
                    .setDescription(
                      `:white_check_mark: Successfully set the greeting message for this guild.`
                    )
                    .setFields({
                      name: "Message:",
                      value: `> ${Message}`,
                    }),
                ],
                components: [
                  new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                      .setCustomId("greetings.message")
                      .setLabel("Reset")
                      .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                      .setCustomId("exit")
                      .setLabel("Exit")
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            });
        }
        break;
      case "view": {
      }
    }
  },
};
