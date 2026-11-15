const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 for(const javaScriptEnabled of [true,false]) {
  const page=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled});
  await page.goto('http://127.0.0.1:8876/studentopus/');
  if(javaScriptEnabled) await page.emulateMedia({reducedMotion:'reduce'});
  const text=await page.locator('body').innerText();
  assert(!text.includes('This month'));
  assert(!text.includes('this month’s'));
  if (!javaScriptEnabled) assert.equal(await page.locator('#month-card').evaluate(e=>getComputedStyle(e).opacity), '1');
  assert(!text.includes('Register by'));
  assert(text.includes('The November session has ended.'));
  assert.equal(await page.locator('[data-session-reserve]').count(),2);
  for(const href of await page.locator('[data-session-reserve]').evaluateAll(es=>es.map(e=>e.href))) assert(href.includes('sibforms.com'));
  await page.locator('#this-month').scrollIntoViewIfNeeded();
  await page.screenshot({path:'/tmp/studentopus-mobile-'+javaScriptEnabled+'.png'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.close();
 }
 const page=await browser.newPage();
 await page.clock.install({time:new Date('2026-11-03T16:44:59Z')});
 await page.goto('http://127.0.0.1:8876/studentopus/');
 assert((await page.locator('[data-session-status]').first().innerText()).includes('Register by'));
 assert((await page.locator('[data-session-reserve]').first().getAttribute('href')).includes('stripe.com'));
 await page.clock.fastForward(1001);
 assert((await page.locator('[data-session-status]').first().innerText()).includes('has closed'));
 assert.equal(await page.locator('[data-session-heading]').innerText(),'Featured session');
 await page.clock.fastForward(75*60*1000);
 assert((await page.locator('[data-session-status]').first().innerText()).includes('has ended'));
 assert.equal(await page.locator('[data-session-heading]').innerText(),'Previous session');
 await browser.close();console.log('PASS: mobile JS/no-JS, no overflow, cutoff, session-end live transition');
})().catch(e=>{console.error(e);process.exit(1)});
