const { EmbedBuilder } = require("@discordjs/builders");
const {
  ButtonInteraction,
  Client,
  PermissionFlagsBits,
  Colors,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    let Button = client.buttons.get(interaction.customId);
    if (!Button) return;
    else if (
      Button.permission &&
      !interaction.member?.permissions.has(
        PermissionFlagsBits[Button.permission]
      )
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> :no_entry_sign: Missing permissions: \`${Command.permission}\``
            ),
        ],
        ephemeral: true,
      });
    else Button.execute(interaction, client);
  },
};
