const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "clean",
  description:
    "Removes a certain amount of messages from the specified channel.",
  permission: "ManageChannels",
  options: [
    {
      name: "amount",
      description: "Input the amount of messages.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "target",
      description: "Select a specific users messages to delete.",
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      type: ApplicationCommandOptionType.String,
      description: "Input a reason.",
    },
  ],
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, channel, guild } = interaction;
    const amount = options.getString("amount");
    const target = guild.members.cache.get(options.getMentionable("target").id);
    const reason = options.getString("reason") || "No reason provided.";

    const msgs = await channel.messages.fetch();
    const filtered = [];
    if (target) {
      let i = 0;
      msgs.filter((m) => {
        if (m.author.id === target.id && amount > i) {
          filtered.push(m);
          i++;
        }
      });

      channel.bulkDelete(filtered, true);
    }
    channel.bulkDelete(amount, true);

    let Amount = amount;
    if (filtered.length > 0) {
      Amount = filtered.length;
    }
    const Embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setDescription(
        `> :broom: Successfully cleaned ${Amount} messages from this channel.\n> 📁 Reason: ${reason}`
      );
    if (target) {
      Embed.setAuthor({
        iconURL: target.avatarURL(),
        name: target.user.username + "#" + target.user.discriminator,
      });
    }
    await interaction.reply({
      embeds: [Embed],
    });

    setTimeout(async () => {
      const reply = await interaction.fetchReply();
      if (reply.deletable) {
        await reply.delete();
      }
    }, ms("10s"));
  },
};
