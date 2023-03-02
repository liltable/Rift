const { EmbedBuilder } = require("@discordjs/builders");
const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Client,
  Colors,
} = require("discord.js");

module.exports = {
  name: "emit",
  description: "Emit an event.",
  bypass: true,
  options: [
    {
      name: "event",
      description: "Select a client event to emit.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "event",
          type: ApplicationCommandOptionType.String,
          description: "Select the event.",
          required: true,
          choices: [
            {
              name: "Member Join",
              value: "guildMemberAdd",
            },
            {
              name: "Member Leave",
              value: "guildMemberRemove",
            },
            {
              name: "Channel Edit",
              value: "channelUpdate",
            },
            {
              name: "Member Edit/Update",
              value: "guildMemberUpdate",
            },
            {
              name: "Channel Add/Create",
              value: "channelCreate",
            },
            {
              name: "Channel Remove/Delete",
              value: "channelDelete",
            },
            {
              name: "Message Remove/Delete",
              value: "messageDelete",
            },
            {
              name: "Message Update/Edit",
              value: "messageUpdate",
            },
            {
              name: "Role Add/Create",
              value: "roleCreate",
            },
            {
              name: "Role Remove/Delete",
              value: "roleDelete",
            },
          ],
        },
      ],
    },
    {
      name: "button",
      description: "Emit a button.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "Input the custom ID of the button to emit.",
          type: ApplicationCommandOptionType.String,
          required: true,
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
    const Sub = interaction.options.getSubcommand(true);
    switch (Sub) {
      case "event":
        {
          const Event = interaction.options.getString("event", true);
          if (Event === "guildMemberAdd") {
            client.emit("guildMemberAdd", interaction.member);
          } else if (Event === "guildMemberRemove") {
            client.emit("guildMemberRemove", interaction.member);
          } else if (Event === "channelUpdate") {
            client.emit(
              "channelUpdate",
              interaction.channel,
              interaction.channel,
              client
            );
          } else if (Event === "guildMemberUpdate") {
            client.emit(
              "guildMemberUpdate",
              interaction.member,
              interaction.member,
              client
            );
          } else if (Event === "channelCreate") {
            client.emit("channelCreate", interaction.channel, client);
          } else if (Event === "channelDelete") {
            client.emit("channelDelete", interaction.channel, client);
          } else if (Event === "messageDelete") {
            let LM = interaction.channel.lastMessage;
            if (!LM) {
              LM = await interaction.channel.send({ content: "No reason." });
            }
            client.emit("messageDelete", LM, client);
            setTimeout(async () => {
              if (LM) {
                if (LM.deletable) {
                  await LM.delete();
                }
              }
            }, ms("5s"));
          } else if (Event === "messageUpdate") {
            const BrokenMessage = await interaction.channel.send({
              content: "No reason.",
            });
            let UnbrokenMessage = null;
            setTimeout(async () => {
              UnbrokenMessage = await BrokenMessage.edit({
                content: "Still, no reason",
              });
              client.emit(
                "messageUpdate",
                BrokenMessage,
                UnbrokenMessage,
                client
              );
            }, ms("1s"));

            setTimeout(async () => {
              if (BrokenMessage.deletable)
                try {
                } catch (err) {
                  console.log(err);
                }
              if (UnbrokenMessage.deletable)
                try {
                  await UnbrokenMessage.delete();
                } catch (err) {
                  console.log(err);
                }
            }, ms("5s"));
          } else if (Event === "roleCreate") {
            const Role = interaction.member.roles.highest;
            client.emit("roleCreate", Role, client);
          } else if (Event === "roleDelete") {
            const Role = interaction.member.roles.highest;
            client.emit("roleCreate", Role, client);
          }
          await interaction.reply({
            embeds: [
              new EmbedBuilder().setDescription(
                `> Successfully emitted: **${
                  this.options[0].choices.find(
                    (choice) => choice.value === Event
                  ).name
                }** (${Event}).`
              ),
            ],
          });
        }
        break;
      case "button":
        {
          const ID = interaction.options.getString("id", true);
          let Button = client.buttons.get(ID);
          if (!Button)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Red)
                  .setDescription(`> :no_entry_sign: Unknown button.`),
              ],
              ephemeral: true,
            });
          else Button.execute(interaction, client);
        }
        break;
    }
  },
};
