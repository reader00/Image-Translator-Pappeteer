const puppeteer = require('puppeteer');
const { writeFileSync } = require('fs');

const pageInfo = async (page) => {
    const title = await page.title();
    const url = await page.url();

    console.log('\nNow on:');
    console.log(`${url} : ${title}`);

    return { url, title };
};

const init = async (img_path, source_lang, target_lang) => {
    const browser = await puppeteer.launch({ userDataDir: `./userData_qory`, headless: 'new' });
    const country_code = {
        japanese: 'ja',
        english: 'en',
        indonesian: 'id',
        chinese: 'zh-CN',
    };

    const google_translate_url = `https://translate.google.com/?hl=en&tab=TT&sl=${
        country_code[source_lang] || 'auto'
    }&tl=${country_code[target_lang]}&op=images`;
    console.log(google_translate_url);

    const upload_button_el = '.CQQi5b.yXgmRe[for="ucj-11"]';
    const img_container_el = '.CMhTbb.tyW0pd .Jmlpdc';
    const download_button_el =
        '.VfPpkd-dgl2Hf-ppHlrf-sM5MNb .VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.LjDxcd.XhPA0b.LQeN7.qaqQfe[aria-label="Download translation"]';

    // Open new page

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(google_translate_url);
    await pageInfo(page);

    // await page.waitForFileChooser();
    // const fileChooser = await page.click(upload_button_el);

    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(upload_button_el),
        // some button that triggers file selection
    ]);
    await fileChooser.accept([img_path]);

    page.c;
    setTimeout(() => {}, 2000);
    // await page._client.send('Page.setDownloadBehavior', {
    //     behavior: 'allow',
    //     downloadPath: 'C:\\Users\\qorya\\OneDrive\\OLD\\Documents\\Skripsi\\Experiment\\Deployment',
    // });
    // await page.click(download_button_el);
    await page.waitForSelector(img_container_el);
    const img_el = await (await page.$(img_container_el)).evaluate((el) => el.getAttribute('src'));
    const img_src = img_el.toString();
    console.log(img_src);

    const img_page = await browser.newPage();
    img_page.goto(img_src);

    page.once('response', async (response) => {
        console.log(response.url());
        const imgBuffer = await response.buffer();
        const milis = +new Date();
        writeFileSync(`download_${milis}.jpg`, imgBuffer);
        console.log('File downloaded');
    });
    await page.evaluate((url) => {
        fetch(url);
    }, img_src);

    // const [fileChooser] = Promise.all([page.waitForFileChooser(), page.click(upload_button_el)]);
    // await fileChooser[0].accept([img_path]);

    // await fileChooser[0].accept([img_path]);

    // await browser.close();
};

init('C:\\Users\\qorya\\Downloads\\a.jpg', '', 'english');
