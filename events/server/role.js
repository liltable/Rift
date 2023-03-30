const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
const { logs } = require("../../types/logs");

module.exports = {
  name: "interactionCreate",
  function: "role",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("role")) return;
    const cache = client.cache.get(interaction.message.id);
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

    const { guild, member } = interaction;

    const args = interaction.customId.split(".");
    const type = args[1];
    const role = guild.roles.cache.get(args[2]);
    switch (type) {
      case "grant":
        {
          let nowHas = null;
          const reason = args[4];
          const target = guild.members.cache.get(args[3]);
          if (target.roles.cache.has(role.id)) {
            await target.roles.remove(role);
            nowHas = false;
          } else {
            await target.roles.add(role);
            nowHas = true;
          }

          await logs.role(
            role,
            target,
            reason,
            parseInt(interaction.createdTimestamp / 1000),
            nowHas,
            member
          );

          const Embed = new EmbedBuilder()
            .setColor(nowHas ? Colors.Green : Colors.Red)
            .setAuthor({
              name: member.user.username + "#" + member.user.discriminator,
              iconURL: member.user.avatarURL(),
            })
            .setThumbnail(`${target.user.avatarURL()}`)
            .setDescription(
              `> ${nowHas ? "Added" : "Removed"} ${role} ${
                nowHas ? "to" : "from"
              } ${target}.\n> Reason: ${reason}`
            );

          const Row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId(
                `roles.grant.${role.id}.${
                  target.id
                }.${`Role grant reversed by ${member.user.username}.`}`
              )
              .setLabel(`${nowHas ? "Redo" : "Undo"}`)
              .setStyle(ButtonStyle.Danger)
          );

          await interaction.reply({
            embeds: [Embed],
            components: [Row],
          });

          await interaction.message.delete();

          await client.cache.set(
            (
              await interaction.fetchReply()
            ).id,
            member.user.id
          );

          setTimeout(async () => {
            if (interaction.message?.deleteable) {
              await interaction.message.delete();
            }
          }, ms("5s"));
        }
        break;
      case "members":
        {
          const Members = role.members
            .map((member) => `${member} (${member.id})`)
            .join(`\n> `)
            .toString();
          const Embed = new EmbedBuilder()
            .setTitle(`${role.name} | Members`)
            .setAuthor({
              name: member.user.username + "#" + member.user.discriminator,
              iconURL: member.user.avatarURL(),
            })
            .setDescription(`> ${Members}`);

          const Row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("exit")
              .setLabel("Exit")
              .setStyle(ButtonStyle.Danger)
          );

          await interaction.reply({ embeds: [Embed], components: [Row] });
          return client.cache.set(
            (await interaction.fetchReply()).id,
            member.user.id
          );
        }
        break;
      case "perms":
        {
          const Perms = role.permissions
            .toArray()
            .join(`\n> `)
            .toString()
            .replace(/[A-Z]/g, " $&")
            .trim();

          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`${role.name} | Permissions`)
                .setAuthor({
                  name: member.user.username + "#" + member.user.discriminator,
                  iconURL: member.user.avatarURL(),
                })
                .setDescription(`> ${Perms}`),
            ],
            components: [
              new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                  .setCustomId("exit")
                  .setLabel("exit")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          });
        }
        break;
    }
  },
};
