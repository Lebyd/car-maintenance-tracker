const fs = require("fs").promises;
const path = require("path");

async function readJson(filePath) {
  const absolutePath = path.join(__dirname, "../../", filePath);
  const data = await fs.readFile(absolutePath, "utf-8");
  return JSON.parse(data || "[]");
}

async function writeJson(filePath, data) {
  const absolutePath = path.join(__dirname, "../../", filePath);
  await fs.writeFile(absolutePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readJson,
  writeJson,
};
