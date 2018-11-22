const fs = require('fs');

function writeConf({ contentObj, src }) {
    fs.writeFileSync(
        src,
        JSON.stringify(contentObj, null, 4),
        'utf8'
    );
}

export {
    writeConf
};