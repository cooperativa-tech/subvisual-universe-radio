const glob = require("glob");
const fs = require("fs");
const path = require("path");

module.exports = () =>
  glob
    .sync(process.cwd() + "/site/_data/transmissions/**.json")
    .map((file) => {
      const transmission = JSON.parse(fs.readFileSync(file));

      return {
        ...transmission,
        date: new Date(transmission.date),
        id: path.basename(file, ".json"),
      };
    })
    .sort((a, b) => b.date - a.date);
