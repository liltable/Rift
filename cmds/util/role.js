const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  Client,
  Colors,
  ButtonStyle,
} = require("discord.js");
const { types } = require("../../types/types");

module.exports = {
  name: "role",
  description: "Manages a role.",
  permission: "ManageRoles",
  options: [
    {
      name: "grant",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Adds/Removes the selected role from the target.",
      options: [
        {
          name: "target",
          description: "Select the target.",
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
        },
        {
          name: "role",
          description: "Select a role to grant.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: "reason",
          description: "Input the reason for the role change.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },
    {
      name: "fetch",
      description: "Fetches the information of a role.",
      options: [
        {
          name: "role",
          description: "Select a role to fetch.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member, options } = interaction;
    const Sub = options.getSubcommand(true);
    switch (Sub) {
      case "grant": {
        const Role = options.getRole("role", true);
        const Target = guild.members.cache.get(
          options.getMentionable("target", true).id
        );
        const Reason = options.getString("reason") || "No reason provided.";
        const Reply = new EmbedBuilder()
          .setColor(Colors.Red)
          .setAuthor({
            name: member.user.username + "#" + member.user.discriminator,
            iconURL: member.user.avatarURL(),
          })
          .setThumbnail(`${Target.user.avatarURL()}`)
          .setDescription(
            `> ${
              Target.roles.cache.has(Role.id) ? "Add" : "Remove"
            } the role ${Role} from ${Target || `\`Failed to fetch\``} (${
              Target.id || `\`-\``
            })?`
          );
        const Row = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId(
              `role.grant.${Role.id}.${Target.id}.${
                Reason || "No reason provided."
              }`
            )
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("exit")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [Reply], components: [Row] });

        return client.cache.set(
          (await interaction.fetchReply()).id,
          member.user.id
        );
      }
      case "fetch": {
        const Role = options.getRole("role", true);
        const Timestamp = parseInt(Role.createdTimestamp / 1000);

        const Embed = new EmbedBuilder()
          .setColor(`${Role.color}`)
          .setAuthor({
            name: member.user.username + "#" + member.user.discriminator,
            iconURL: member.user.avatarURL(),
          })
          .setTitle(`${Role.name} | Info`)
          .setDescription(
            `Name: ${Role.name}\n> ID: ${
              Role.id
            }\n> Created: <t:${Timestamp}:D> at <t:${Timestamp}:T> | <t:${Timestamp}:R>\n> Color: ${
              Role.hexColor || Role.color
            }\n> Position: ${Role.position || Role.rawPosition}\n> Hoist: ${
              Role.hoist ? `${types.formats.yes}` : `${types.formats.no}`
            }\n> Managed: ${
              Role.managed ? `${types.formats.yes}` : `${types.formats.no}`
            }\n\n *The following properties only apply to the bot.*\n> Editable: ${
              Role.editable ? `${types.formats.yes}` : `${types.formats.no}`
            }`
          );

        const Row = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId(`role.members.${Role.id}`)
            .setLabel("View Members")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId(`role.perms.${Role.id}`)
        );

        await interaction.reply({ embeds: [Embed], components: [Row] });
        return client.cache.set(
          (await interaction.fetchReply()).id,
          interaction.user.id
        );
      }
    }
  },
};
