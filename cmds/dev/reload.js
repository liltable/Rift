const {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Colors,
  Embed,
} = require("discord.js");
const client = require("../../");
const { load } = require("../../functions/load");

module.exports = {
  name: "reload",
  description: "Reloads a component of the client",
  bypass: true,
  options: [
    {
      name: "commands",
      description: "Reloads the client commands.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "events",
      description: "Reloads the client events.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "buttons",
      description: "Reload the client buttons.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const Sub = interaction.options.getSubcommand(true);
    switch (Sub) {
      case "commands":
        {
          await load.commands(client).then(async () => {
            console.log(
              `Client commands reloaded by ${
                interaction.user.username + "#" + interaction.user.discriminator
              } (${interaction.user.id}).`
            );
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Green)
                  .setDescription(
                    `> :white_check_mark: Successfully reloaded the client's commands.`
                  ),
              ],
              ephemeral: true,
            });
          });
        }
        break;
      case "events":
        {
          await load.events(client).then(async () => {
            console.log(
              `Client events reloaded by ${
                interaction.user.username + "#" + interaction.user.discriminator
              } (${interaction.user.id}).`
            );
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Green)
                  .setDescription(
                    `> :white_check_mark: Successfully reloaded the client's events.`
                  ),
              ],
              ephemeral: true,
            });
          });
        }
        break;
      case "buttons": {
        await load.buttons(client).then(async () => {
          console.log(
            `Client buttons reload by ${
              interaction.user.username + "#" + interaction.user.discriminator
            } (${interaction.user.id})`
          );
        });

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Green)
              .setDescription(
                `> :white_check_mark: Successfully reload the client's buttons.`
              ),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
