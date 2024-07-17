import asyncio

from mokr import launch


async def main():
    async with launch(
            browser_type="chrome",
            binary_path="/usr/bin/chromium-browser",
            # browser_type="firefox",
            # binary_path="/usr/bin/firefox",
            headless=True,
            ) as browser:
        page = await browser.first_page()
        await page.goto("http://127.0.0.2:9091")
        await asyncio.sleep(1)

asyncio.run(main())
