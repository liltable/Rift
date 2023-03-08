const {
  ChatInputCommandInteraction,
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timeout",
  description:
    "Temporarily disables a member's ability to interact with the guild. ",
  permission: "ModerateMembers",
  options: [
    {
      name: "target",
      description: "Select the target.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Input a duration.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "Input a reason.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const target = guild.members.cache.get(
      options.getMentionable("target", true).id
    );
    const duration = options.getString("duration", true);
    const reason = options.getString("reason") || "No reason provided.";

    if (!ms(duration))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> :no_entry_sign: Invalid parameter (duration): \`Must be a shortened duration: e.g 2d (two days), 30m (30 minutes), 2h (two hours).\``
            ),
        ],
        ephemeral: true,
      });

    if (!target.moderatable) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            `> Missing permissions: \`${this.permission}\``
          ),
        ],
        ephemeral: true,
      });
    }

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setDescription(`> Timeout ${target} for ${duration} for **${reason}**?`)
      .setAuthor({
        name: target.user.username + "#" + target.user.discriminator,
        iconURL: target.user.avatarURL(),
      });

    const Row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId(`timeout.${target.id}.${reason}.${duration}`)
        .setStyle(ButtonStyle.Success)
        .setLabel("Confirm"),
      new ButtonBuilder()
        .setCustomId("exit")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      embeds: [Reply],
      components: [Row],
    });

    return client.cache.set(
      (await interaction.fetchReply()).id,
      interaction.user.id
    );
  },
};
