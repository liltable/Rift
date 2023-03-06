const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("@discordjs/builders");
const {
  ChatInputCommandInteraction,
  Client,
  ApplicationCommandOptionType,
  ButtonStyle,
  Colors,
} = require("discord.js");

module.exports = {
  name: "kick",
  description: "Removes a member from the server.",
  permission: "KickMembers",
  options: [
    {
      name: "target",
      description: "Select a target.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Input a reason.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {String} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const target = guild.members.cache.get(options.getMentionable("target").id);
    const reason = options.getString("reason") || "No reason provided.";

    if (!target.kickable)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> Missing permissions: \`${this.permission}\``),
        ],
        ephemeral: true,
      });

    const Row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId(`kick.${target.id}.${reason}`)
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("exit")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setDescription(`> Kick ${target} for **${reason}**?`)
      .setAuthor({
        name: target.user.username + "#" + target.user.discriminator,
        iconURL: target.user.avatarURL(),
      });

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
