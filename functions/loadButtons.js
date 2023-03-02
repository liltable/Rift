const asciiTable = require("ascii-table");
const { PermissionFlagsBits } = require("discord.js");
const { loadFiles } = require("./loadFiles");
/**
 *
 * @param {Client} client
 * @returns
 */
async function loadButtons(client) {
  await client.buttons.clear();
  const Files = await loadFiles("btns");
  const btnTable = new asciiTable().setHeading("btn", "status");
  const btnArr = [];

  Files.forEach((file) => {
    const btn = require(file);
    const x = file.split("/");
    const File = `${
      x[x.length - 3] + "/" + x[x.length - 2] + "/" + x[x.length - 1]
    }`;

    if (!btn.id) return btnTable.addRow(File, "🔴");
    if (btn.permission && !PermissionFlagsBits[btn.permission])
      return btnTable.addRow(btn.id, "🔧 (Perm)");
    if (btn.bypass) {
      client.buttons.set(btn.id, btn);
      btnArr.push(btn);
      return btnTable.addRow(btn.id, "🔵");
    }

    btnTable.addRow(btn.id, "🟢");
    btnArr.push(btn);
    client.buttons.set(btn.id, btn);
  });
  return console.log(
    btnTable.toString(),
    `\nSuccessfully loaded ${btnArr.length} button(s).`
  );
}

module.exports = {
  loadButtons,
};
