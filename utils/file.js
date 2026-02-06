const fs = require('fs');
const path = require('path');

exports.deleteFile = (filePath) => {
    // path.resolve ensures we are looking relative to the project root
    const absolutePath = path.resolve(filePath);

    fs.unlink(absolutePath, (err) => {
        if (err) {
            console.log(`Skipping deletion: File not found at ${absolutePath}`);
            // Do NOT throw err here
        } else {
            console.log(`Successfully deleted: ${absolutePath}`);
        }
    });
};
