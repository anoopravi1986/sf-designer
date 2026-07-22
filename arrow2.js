const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\Program Files\Google\Chrome\Application\chrome.exe',
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  try { await page.click('text=Designs', { timeout: 5000 }); } catch (e) {}
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'arrow-region.png', clip: { x: 60, y: 170, width: 400, height: 60 } });
  await ctx.close();
  await browser.close();
  console.log('done');
})();
