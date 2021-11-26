const fs = require("fs");
const path = `${__dirname}/public/dist`;

/**
 * Function to get the active asset files for the frontend
 *
 * @return {any}
 */
module.exports = () => {
    const manifest = JSON.parse(fs.existsSync(path) ? fs.readFileSync(`${path}/rev-manifest.json`) : "{}");

    return {
        "main.js": manifest["main.js"],
        "main.css": fs.readFileSync(`${path}/${manifest["main.css"]}`)
    };
};
