const { join } = require("path");
const { readdirSync, renameSync } = require("fs");
const [dir, search, replace] = process.argv.slice(2);
const match = RegExp(search, "g");
const files = readdirSync(dir);

files
  .filter((file) => file.match(match))
  .forEach((file) => {
    const filePath = join(dir, file);

    const newFileName = file.substring(0, 4) + "_" + file.substring(4);
    const newFilePath = join(dir, newFileName);

    console.log(newFilePath);

    renameSync(filePath, newFilePath);
  });
