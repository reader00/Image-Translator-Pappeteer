const download = require('image-downloader');

const downloader = async (url) => {
    // const dest = `C:\\Users\\qorya\\Desktop\\r.eader\\Script\\Utility\\Image Translation\\downloads\\source\\source_${+new Date()}.jpeg`;
    const dest = `/home/ilya3anggela_gmail_com/Image-Translator-Pappeteer/downloads/source/source_${+new Date()}.jpg`;
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
