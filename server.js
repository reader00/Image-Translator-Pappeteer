const Hapi = require('@hapi/hapi');
const translator = require('./browser');
const downloader = require('./image_downloader');
const Path = require('path');

const init = async () => {
    const server = Hapi.server({
        // host: '0.0.0.0',
        host: 'localhost',
        port: 6969,
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'downloads'),
            },
        },
    });

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
            const status = await translator(image_path, source_lang, target_lang);

            return status;
        },
    });

    server.start();

    console.log(`Server running on -----> ${server.info.uri}`);
};

init();
