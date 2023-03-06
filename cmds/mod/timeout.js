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
    const { options, member, guild } = interaction;
    const target = guild.members.cache.get(
      options.getMentionable("target", true).id
    );
    const duration = options.getString("duration", true);
    const reason = options.getString("reason", true) || "No reason provided.";
    const timestamp = parseInt(interaction.createdTimestamp / 1000);

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

    return interaction.reply({
      embeds: [Reply],
      components: [Row],
      ephemeral: true,
    });
  },
};
