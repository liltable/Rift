const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Colors,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { types } = require("../../types/types");
const { icons } = require("../../icons/urls");
const { storage } = require("../../schemas/guild");

module.exports = {
  name: "nuke",
  permission: "ManageChannels",
  description: "Clones then deletes a channel for convienence.",
  options: [
    {
      name: "channel",
      description: "Select the channel.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "reason",
      description: "Input a reason.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member } = interaction;
    const channel = options.getChannel("channel", true);
    const reason = options.getString("reason", true);

    if (!channel.manageable || !channel.deletable)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> ${types.formats.no} Missing permissions: \`${this.permission}\``
            ),
        ],
        ephemeral: true,
      });

    const server = await storage.findOne({ guild: interaction.guild.id });
    if (server.logs.channel === channel.id)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`> You can't nuke the set logging channel!`)
            .setAuthor({
              name:
                interaction.user.username +
                "#" +
                interaction.user.discriminator,
              iconURL: interaction.user.avatarURL(),
            }),
        ],
        ephemeral: true,
      });

    const Row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId(
          `nuke.${channel.id}.${reason}.${member.user.id}.${interaction.guild.id}`
        )
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("exit")
    );

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({
        name: member.user.username + "#" + member.user.discriminator,
        iconURL: member.user.avatarURL(),
      })
      .setThumbnail(`${icons.delete}`)
      .setDescription(
        `> ${types.formats.no} Nuke ${channel} for **${reason}**?\n> Note: This is a dangerous action that can remove important messages.\n> However, a transcript will be stored in the logging channel for this guild (if setup).`
      );

    await interaction.reply({ embeds: [Reply], components: [Row] });

    return client.cache.set(
      (await interaction.fetchReply()).id,
      member.user.id
    );
  },
};
