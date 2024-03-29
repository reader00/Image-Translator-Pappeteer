const download = require('image-downloader');

const downloader = async (url) => {
    const dest = `C:\\Users\\qorya\\Desktop\\r.eader\\Script\\Utility\\Image Translation\\downloads\\source\\source_${+new Date()}.jpeg`;
    options = {
        url,
        dest, // will be saved to /path/to/dest/photo.jpg,
        extractFilename: false,
    };

    await download.image(options);

    console.log('Image downloaded: ' + dest);
    return dest;
};

module.exports = downloader;
