const { ButtonInteraction } = require("discord.js");

module.exports = {
  id: "exit",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (interaction.message && interaction.message.deletable) {
      await interaction.message.delete();
    } else {
      return interaction.reply({
        content: `Failed to delete this message.\nIf the message is ephemeral, please click "Dismiss Message" at the bottom of the message.`,
        ephemeral: true,
      });
    }
  },
};
