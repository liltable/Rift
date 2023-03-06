const { Client } = require("discord.js");
const { loadFiles } = require("./loadFiles");
/**
 *
 * @param {Client} client
 * @returns
 */
async function loadEvents(client) {
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Events:", "Status:");

  await client.events.clear();

  const Files = await loadFiles("Events");

  Files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);
    client.events.set;
    event.name, execute;
    const x = file.split("/");
    const File = `${
      x[x.length - 3] + "/" + x[x.length - 2] + "/" + x[x.length - 1]
    }`;

    if (!event.name) return table.addRow(File, "🔴");
    if (!event.function) return table.addRow(event.name, "🔴 ");

    if (event.rest) {
      if (event.once) client.execute(event.name, execute);
      else client.rest.on(event.name, execute);
    } else {
      if (event.once) client.once(event.name, execute);
      else client.on(event.name, execute);
    }

    table.addRow(event.function, "🟩");
  });

  return console.log(table.toString(), `\nLoaded ${Files.length} event(s).`);
}

module.exports = {
  loadEvents,
};
