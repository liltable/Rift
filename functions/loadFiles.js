/**
 *
 * @param {String} dirName
 */
async function loadFiles(dirName) {
  const { promisify } = require("util");
  const { glob } = require("glob");
  const ProGlob = promisify(glob);

  const Files = await ProGlob(
    `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
  );
  Files.forEach((file) => delete require.cache[require.resolve(file)]);
  return Files;
}
module.exports = {
  loadFiles,
};
