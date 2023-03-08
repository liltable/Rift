const { model, Schema } = require("mongoose");

const storage = model(
  "rift",
  new Schema({
    guild: { type: String, required: true },
    logs: {
      enabled: { type: Boolean, default: false, enum: [false, true] },
      channel: { type: String, required: false },
      events: Array,
    },
  })
);

module.exports = {
  storage,
};
