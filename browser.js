const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { writeFileSync, unlinkSync, existsSync, readdirSync, statSync } = require('fs');
const { spawnSync} = require('child_process');
//const child = spawnSync('ls', ['-lh', '/usr']);

//console.log('error\t: ', `${child.error}`);
//console.log('stdout\t: ', `${child.stdout}`);
//console.log('stderr\t: ', `${child.stderr}`);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const singletonDir = '/home/ilya3anggela_gmail_com/Image-Translator-Pappeteer/userData_qory/'
const singletonLock = singletonDir + 'SingletonLock';
const singletonCookie = singletonDir + 'SingletonCookie';
const singletonSocket = singletonDir + 'SingletonSocket';


const get_files = (dir, singleton=false) => {
    const files = readdirSync(dir)
        .map((f) => dir + f)
        .filter((f) => {
		const isFile = statSync(f).isFile()
		if(isFile && singleton){
			console.log('if singleton')
			console.log(f)
			console.log(f.includes('Singleton'))
			console.log(typeof f)
			return f.includes('Singleton')
		}
		return isFile
	});
    console.log('files')
    console.log(files);
    return files;
};

const deleteMultiFiles = (files) => {
    for(let i = 0; i < files.length; i++){
	if(existsSync(files[i])){
	    unlinkSync(files[i])
	}
    }
}

const pageInfo = async (page) => {
    const title = await page.title();
    const url = await page.url();

    console.log('\nNow on:');
    console.log(`${url} : ${title}`);

    return { url, title };
};

const launchBrowser = async () => {
    const child = spawnSync('rm', ['-r', './userData_qory/SingletonLock']);

    console.log('error', `${child.error}`);
    console.log('stdout ', `${child.stdout}`);
    console.log('stderr ', `${child.stderr}`);

    console.log("Creating new browser");
    try{
    const browser = await puppeteer.launch({
            userDataDir: `./userData_qory`,
            headless: 'new',
            // headless: false,
            // executablePath: chrome_path,
            // ignoreDefaultArgs: '--enable-automation',
    });
    console.log()
    return browser;
    }catch(e){
	console.log(e);
        console.log()
	//get_files(singletonDir, true)
	console.log()
        console.log("DELETING SINGLETON")
	console.log()
	//deleteMultiFiles([singletonLock, singletonCookie, singletonSocket])
	console.log("SINGLETON DELETED")
	console.log();
        //get_files(singletonDir, true)
	console.log();
	return false;
    }
}

const translator = async (browser, img_path, source_lang, target_lang) => {
//    deleteMultiFiles([singletonLock, singletonCookie, singletonSocket])
    if(existsSync('/home/ilya3anggela_gmail_com/Image-Translator-Pappeteer/userData_qory/SingletonLock')){
	unlinkSync('/home/ilya3anggela_gmail_com/Image-Translator-Pappeteer/userData_qory/SingletonLock');
    }
    let success = false;
    const chrome_path = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

    const country_code = {
        japanese: 'ja',
        english: 'en',
        indonesian: 'id',
        chinese: 'zh-CN',
    };

    console.log();
    console.log(`IMAGE PATH\t: ${img_path}`);
    console.log(`SOURCE LANGUAGE\t: ${country_code[source_lang] || 'auto'}`);
    console.log(`TARGET LANGUAGE\t: ${country_code[target_lang]}`);
    console.log();

    const google_translate_url = `https://translate.google.com/?hl=en&tab=TT&sl=${
        country_code[source_lang] || 'auto'
    }&tl=${country_code[target_lang]}&op=images`;
    console.log(google_translate_url);

    const upload_button_el = '.CQQi5b.yXgmRe[for="ucj-11"]';
    const img_container_el = '.CMhTbb.tyW0pd .Jmlpdc';
    const download_button_el =
        '.VfPpkd-dgl2Hf-ppHlrf-sM5MNb .VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.LjDxcd.XhPA0b.LQeN7.qaqQfe[aria-label="Download translation"]';

    // Open new page
    try{
    console.log('Open new page');
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(google_translate_url);
    await pageInfo(page);

    // await page.waitForFileChooser();
    // const fileChooser = await page.click(upload_button_el);

    // await delay(291);
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(upload_button_el),
        // some button that triggers file selection
    ]);
    // await delay(840);

    console.log(`Uploading image... (${img_path})`);
    await fileChooser.accept([img_path]);

    // await delay(2998);
    // await page._client.send('Page.setDownloadBehavior', {
    //     behavior: 'allow',
    //     downloadPath: 'C:\\Users\\qorya\\OneDrive\\OLD\\Documents\\Skripsi\\Experiment\\Deployment',
    // });
    // await page.click(download_button_el);
    await page.waitForSelector(img_container_el);
    const img_el = await (await page.$(img_container_el)).evaluate((el) => el.getAttribute('src'));
    const img_src = img_el.toString();
    console.log(img_src);

    const img_name = `translate_${+new Date()}.jpg`;


        page.once('response', async (response) => {
            console.log(response.url());
            const imgBuffer = await response.buffer();
            writeFileSync(`./downloads/${img_name}`, imgBuffer);
            console.log('File downloaded');
            success = true;
        });
        await page.evaluate((url) => {
	    console.log('FETCHING');
	    console.log(url);
            fetch(url);
        }, img_src);

       await delay(100);

	console.log("Closing Page")
	await page.close()
        //await browser.close();
	//console.log("Browser clossed")
	console.log("Browser closed")

        if (success) return img_name;
        return 'fail';
    } catch (error) {
        console.log('Error');
        console.log(error);
	deleteMultiFiles([singletonLock, singletonCookie, singletonSocket]);
	await page.close();

        return false;
    }

    // const [fileChooser] = Promise.all([page.waitForFileChooser(), page.click(upload_button_el)]);
    // await fileChooser[0].accept([img_path]);

    // await fileChooser[0].accept([img_path]);
};

// init(
//     '/home/ilya3anggela_gmail_com/Image-Translator-Pappeteer/downloads/source/source_1685488195875.jpg',
//     '',
//    'english'
// );

module.exports = {translator, launchBrowser};
