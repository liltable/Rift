const { createTranscript } = require("discord-html-transcripts");
const {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { icons } = require("../../icons/urls");
const { logs } = require("../../types/logs");

module.exports = {
  name: "save",
  description: "Saves the content of a channel inside an HTML file.",
  options: [
    {
      name: "amount",
      type: ApplicationCommandOptionType.Number,
      description:
        "Select the amount of messages you want to save. (defualt 250)",
      required: false,
    },
    {
      name: "reason",
      description: "Input the reason for the channel save.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, options, user, member } = interaction;
    const Amount = options.getNumber("amount") || 250;
    const Reason = options.getString("reason") || "No reason provided.";

    const Attachment = await createTranscript(channel, {
      limit: Amount,
      filename: `${channel.name}-save.html`,
      saveImages: true,
      poweredBy: false,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle("Rift | Save")
          .setThumbnail(icons.create)
          .setAuthor({
            name: user.username + "#" + user.discriminator,
            iconURL: user.avatarURL(),
          })
          .setDescription(
            `> Successfully saved the contents of this channel (${channel}).\n> Reason: ${Reason}`
          ),
      ],
      files: [Attachment],
    });

    return logs.save(
      Attachment,
      Reason,
      member,
      channel,
      Amount,
      parseInt(interaction.createdTimestamp / 1000)
    );
  },
};
