const Hapi = require('@hapi/hapi');
const { translator, launchBrowser } = require('./browser');
const downloader = require('./image_downloader');
const Path = require('path');

const init = async () => {
    const server = Hapi.server({
        host: '0.0.0.0',
        // host: 'localhost',
        port: 6969,
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'downloads'),
            },
	    cors: {
		origin: ['*'], // an array of origins or 'ignore'
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'], // all default apart from Accept-language
                additionalHeaders: ['cache-control', 'x-requested-with', 'Access-Control-Allow-Origin']
	    }
        },
    });
    const browser = await launchBrowser();

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/public/{filename}',
        handler: function (req, res) {
            const { filename } = req.params;

            return res.file(filename);
        },
    });

    server.route({
        path: '/translate',
        method: 'POST',
        handler: async (req, res) => {
            const { url, source_lang, target_lang } = req.payload;
            const image_path = await downloader(url);

            console.log('Deploy browser...')
            const img_name = await translator(browser, image_path, source_lang, target_lang)

            return img_name;
        },
    });

    server.start();

    console.log(`Server running on -----> ${server.info.uri}`);
};

init();
