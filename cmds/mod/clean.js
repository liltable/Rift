const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
      name: "filter",
      type: ApplicationCommandOptionType.String,
      description:
        "Filter for a specific word/phrase in the messages to be cleaned.",
    },
    {
      name: "reason",
      type: ApplicationCommandOptionType.String,
      description: "Input a reason.",
    },
  ],
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, channel, guild } = interaction;

    const amount = options.getString("amount");
    const mentionable = options.getMentionable("target");
    const contentFilter = options.getString("filter") || null;
    const target = guild.members.cache.get(mentionable?.id) || null;
    const reason = options.getString("reason");

    const msgs = await channel.messages.fetch();
    /**
     *
     * @param {Array} arr
     * @returns
     */
    function removeDuplicates(arr) {
      return arr.filter((item, index) => arr.indexOf(item) === index);
    }

    let filtered = [];
    if (contentFilter) {
      msgs.forEach(async (msg) => {
        if (msg.partial) await msg.fetch();

        if (msg.content.toLowerCase().includes(contentFilter.toLowerCase())) {
          filtered.push(msg);
        }
        filtered.forEach((msg, index) => {
          if (
            !msg.content.toLowerCase().includes(contentFilter.toLowerCase())
          ) {
            filtered.splice(index, 1);
          }
        });
      });
    }
    if (target) {
      msgs.forEach(async (msg) => {
        if (msg.partial) await msg.fetch();

        if (msg.author.id === target.id) {
          filtered.push(msg);
        }

        filtered.forEach((msg, index) => {
          if (msg.author.id !== target.user.id) {
            filtered.splice(index, 1);
          }
        });
      });
    }

    filtered = removeDuplicates(filtered);

    if (filtered.length > 100) {
      const quotient = Math.floor(filtered.length / 100);
      const remainder = quotient % 100;
      for (var i = 0; i !== quotient; i++) {
        await channel.bulkDelete(filtered.splice(100, filtered.length - 100));
      }
      if (remainder > 0) {
        channel.bulkDelete(
          filtered.splice(remainder, filtered.length - remainder)
        );
      }
    } else if (filtered.length > 0) {
      await channel.bulkDelete(filtered, true);
    } else if (amount > 100) {
      const quotient = Math.floor(amount / 100);
      const remainder = quotient % 100;
      for (var i = 0; i !== quotient; i++) {
        await channel.bulkDelete(100, true);
      }
      if (remainder > 0) {
        await channel.bulkDelete(remainder, true);
      }
    } else await channel.bulkDelete(amount, true);

    let Amount = amount;
    if (filtered.length > 0) {
      Amount = filtered.length;
    }

    const embDesc = [
      `> Successfully deleted ${Amount} message(s) from this channel.`,
    ];

    if (contentFilter) embDesc.push(`> Keyword: ${contentFilter}`);
    if (reason) embDesc.push(`> Reason: ${reason}`);
    if (target)
      embDesc.push(
        `> Target: ${target || "`Failed to fetch.`"} (${target.id || `\`-\``})`
      );

    embDesc.push(
      `> Please note that it may take a few seconds for the deletions to process.`
    );

    const Embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setDescription(embDesc.join(`\n`).toString());

    if (target) {
      Embed.setAuthor({
        iconURL: target.user.avatarURL(),
        name: target.user.username + "#" + target.user.discriminator,
      });
    }

    await interaction.reply({
      embeds: [Embed],
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("exit")
            .setLabel("Exit")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });

    return client.cache.set(
      (await interaction.fetchReply()).id,
      interaction.user.id
    );
  },
};
