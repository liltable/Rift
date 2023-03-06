const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  function: "commands",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const Command = await client.commands.get(interaction.commandName);
    if (!Command)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> :no_entry_sign: This command is outdated.`),
        ],
        ephemeral: true,
      });
    if (
      Command.permission &&
      !interaction.memberPermissions.has(
        PermissionFlagsBits[Command.permission]
      )
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> :no_entry_sign: Missing permission: \`${Command.permission}\``
            ),
        ],
        ephemeral: true,
      });

    if (
      Command.bypass &&
      !client.config.bypassers.includes(interaction.user.id)
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> :no_entry_sign: This command can only be used by client bypassers.s`
            ),
        ],
        ephemeral: true,
      });

    if (Command.disabled) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> :no_entry_sign: This command is disabled.`),
        ],
        ephemeral: true,
      });
    }
    Command.execute(interaction, client);
  },
};
