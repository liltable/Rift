const table = require("ascii-table");
const { Client, PermissionFlagsBits } = require("discord.js");
const { loadFiles } = require("./loadFiles");

/**
 *
 * @param {Client} client
 */
async function loadCmds(client) {
  const Files = await loadFiles("cmds");
  const cmdTable = new table().setHeading("cmd", "status");
  const cmdArr = [];
  Files.forEach((file) => {
    const cmd = require(file);
    const x = file.split("/");
    const File = `${
      x[x.length - 3] + "/" + x[x.length - 2] + "/" + x[x.length - 1]
    }`;

    if (!cmd.name) return cmdTable.addRow(File, "🔴");
    if (!cmd.description) return cmdTable.addRow(cmd.name, "🔴");
    if (cmd.permission && !PermissionFlagsBits[cmd.permission]) {
      return cmdTable.addRow(cmd.name, "🔧 (Perm)");
    }

    cmdTable.addRow(cmd.name, "🟢");
    client.commands.set(cmd.name, cmd);
    cmdArr.push(cmd);
  });

  console.log(cmdTable.toString(), `\nLoaded ${cmdArr.length} command(s).`);

  if (client.application) {
    client.application.commands.set(cmdArr);
  }
}
module.exports = {
  loadCmds,
};
