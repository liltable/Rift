const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const icons = require("../../icons/urls");
const { storage } = require("../../schemas/guild");
const ms = require("ms");

module.exports = {
  name: "ban",
  description: "Bans a guild member.",
  permission: "BanMembers",
  options: [
    {
      name: "target",
      description: "Select a member.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Input a reason.",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "messages",
      description: "Delete the target's messages?",
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member, options } = interaction;

    const target = await guild.members.fetch(
      options.getMentionable("target", true).id
    );

    const reason = options.getString("reason") || "No reason provided.";

    const delMsgs = options.getBoolean("messages") ? "604800" : "0";

    if (!target.bannable) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `> :no_entry_sign: Missing permissions: \`${this.permission}\``
            ),
        ],
        ephemeral: true,
      });
    }

    const Row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId(`ban.${target.id}.${reason}.${delMsgs}`)
        .setStyle(ButtonStyle.Success)
        .setLabel("Confirm"),
      new ButtonBuilder()
        .setCustomId("exit")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({
        iconURL: target.user.avatarURL(),
        name: target.user.username + "#" + target.user.discriminator,
      })
      .setDescription(`Ban ${target} for **${reason}**?`);

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
