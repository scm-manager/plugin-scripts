const path = require("path");

module.exports = {
  content: [path.join(process.cwd(), "src", "main", "js", "**", "*.tsx")],
  theme: {
    extend: {}
  },
  plugins: []
};
