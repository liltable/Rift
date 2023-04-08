const { ButtonInteraction, Client } = require("discord.js");

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

    const type = args[1];
    switch (type) {
      case "toggle":
        {
        }
        break;
      case "style":
        {
        }
        break;
    }
  },
};
