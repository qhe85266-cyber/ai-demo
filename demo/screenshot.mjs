// 用 Playwright（无头浏览器）给本地站点截图，只访问 127.0.0.1:3000 的公开页面，不登录后台。
import { chromium } from '/workspace/AIHOT/node_modules/playwright/index.mjs';
const out = '/workspace/AIHOT-setup/screenshots';
const pages = [['home', '/'], ['all', '/all'], ['hot', '/hot'], ['topics', '/topics'], ['about', '/about'], ['daily', '/daily']];
const browser = await chromium.launch();
for (const [scheme, suffix] of [['light', ''], ['dark', '-dark']]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: scheme, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [name, path] of (scheme === 'dark' ? pages.slice(0, 1) : pages)) {
    await page.goto('http://127.0.0.1:3000' + path, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/${name}${suffix}.png`, fullPage: false });
    console.log('saved', name + suffix);
  }
  await ctx.close();
}
// 手机尺寸首页
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const mp = await m.newPage();
await mp.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
await mp.screenshot({ path: `${out}/home-mobile.png` });
// 第一条精选的详情页
const first = await mp.evaluate(() => document.querySelector('a[href^="/items/"]')?.getAttribute('href'));
if (first) { await mp.goto('http://127.0.0.1:3000' + first, { waitUntil: 'networkidle' }); await mp.screenshot({ path: `${out}/item-mobile.png` }); console.log('saved item', first); }
await browser.close();
