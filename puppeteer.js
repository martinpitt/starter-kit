import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
    product: 'chrome',
    executablePath: "/usr/lib64/chromium-browser/headless_shell",
    // executablePath: '/usr/bin/chromium-browser',

    // does not work in either CDP or BiDi mode with p-core
    // product: 'firefox',
    // executablePath: '/usr/bin/firefox',

    // catastrophe: segfault chromium-browser (in all modes), timeout with firefox
    // protocol: 'webDriverBiDi',
    headless: true,
});

try {
    const page = await browser.newPage();
    /*
     * TODO: log interception
    await b.sessionSubscribe({ events: ['log.entryAdded'] });
    b.on('log.entryAdded', l => console.log('log.entryAdded:', l));
    await b.executeScript('console.log("Hello Bidi")', []);
    */

    await page.goto("http://127.0.0.2:9091");

    await page.locator("#login-user-input").fill("admin");
    await page.locator("#login-password-input").fill("foobar");
    await page.locator("#login-button").click();

    const sui = await page.waitForSelector("#super-user-indicator");
    const t = await sui.evaluate(e => e.textContent);
    if (t !== "Limited access")
        throw new Error(`Expected 'Limited access', got '${t}'`);

    // TODO: this isn't unique, but there's no option to enforce that or return all matches
    await page.waitForSelector("button");

    // overview frame
    const f_overview = await page.frames().find(f => f.name() === "cockpit1:localhost/system");

    const cct = await f_overview.$eval('.system-configuration', e => e.textContent);
    if (!cct.includes("Join domain"))
        throw new Error(`Expected 'Join domain' in '${cct}'`);

    // TODO: screenshot

    console.log("\n\nFinished. Press Control-C to exit");
    await new Promise(resolve => setTimeout(resolve, 100000));
} finally {
    await browser.close();
}
