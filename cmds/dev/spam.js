const { EmbedBuilder } = require("@discordjs/builders");
const {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
module.exports = {
  name: "spam",
  description: "Spam's a message inside a channel.",
  permission: "Administrator",
  options: [
    {
      name: "content",
      description: "Input the content of the message(s).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "amount",
      description: "Select the amount of messages to be sent.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, channel } = interaction;
    const content = options.getString("content", true);
    const amount = options.getNumber("amount", true);

    if (amount > 50)
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            `> :no_entry_sign: The amount of messages has to be less than fifty (50).`
          ),
        ],
        ephemeral: true,
      });

    for (var i = amount; i !== 0, i--; ) {
      channel.send({ content: content });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(
          `> :white_check_mark: Spammed: "${content}" ${amount} time(s) in this channel.`
        ),
      ],
      ephemeral: true,
    });
  },
};
