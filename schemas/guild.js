const { model, Schema } = require("mongoose");

const storage = model(
  "rift",
  new Schema({
    guild: { type: String, required: true },
    logs: {
      enabled: { type: Boolean, default: false, enum: [false, true] },
      channel: { type: String, required: false },
    },
    greeting: {
      enabled: { type: Boolean, default: false, enum: [false, true] },
      style: {
        type: String,
        required: true,
        default: "dm",
        enum: ["channel", "dm"],
      },
      channel: {
        type: String,
        default: null,
      },
    },
  })
);

module.exports = {
  storage,
};
