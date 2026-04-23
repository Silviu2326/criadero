const fs = require("fs");
const base = "C:/Users/ciorp/Downloads/erpcriadero/frontend/src/pages/landing/blog/";
function writeFile(name, content) {
  fs.writeFileSync(base + name, content);
  console.log(name);
}
