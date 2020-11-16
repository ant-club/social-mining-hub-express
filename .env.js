const path = require("path");
const fs = require("fs");

function dotenvJSON(options) {
  const jsonFile = (options && options.path) || ".env.json";

  const jsonString = fs.readFileSync(path.resolve(process.cwd(), jsonFile), {
    encoding: "utf8"
  });

  try {
    const envConfig = JSON.parse(jsonString);

    for (const key in envConfig) {
      const value = envConfig[key];
      if (typeof value === 'object') {
        process.env[key] = process.env[key] || JSON.stringify(value);
      } else {
        process.env[key] = process.env[key] || value;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

dotenvJSON();
