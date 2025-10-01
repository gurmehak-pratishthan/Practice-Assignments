const fs = require("fs");

// Step 1: Read the log file
const logs = fs.readFileSync("app.log", "utf-8");

// Step 2: Regex to capture ERROR messages
// const regex = /^.*ERROR (.*)$/gm;

// let match;
// while ((match = regex.exec(logs)) !== null) {
//   console.log("Error message:", match[1]);
// }
const regex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ERROR (.*)$/gm;

let match;
while ((match = regex.exec(logs)) !== null) {
  console.log("At", match[1], "->", match[2]);
}
