// Run with Playwright installed: BASE_URL=http://localhost:8877 node tests/testimonials-browser.cjs
const assert = require('node:assert/strict');
const { chromium, webkit, devices } = require('playwright');
const { testimonials } = require('../src/data/testimonials.json');
const base = process.env.BASE_URL || 'http://127.0.0.1:8877';
const path = require('node:path');
const out = process.env.QA_DIR || '/tmp/mindfulopus-qa';
require('node:fs').mkdirSync(out,{recursive:true});
(async()=>{
 for(const [name,type] of [['chromium',chromium],['webkit',webkit]]){
  if (process.env.BROWSER && name !== process.env.BROWSER) continue;
  const browser=await type.launch({headless:true,...(name==='chromium' && process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH}: {})});
  try {for(const [label,device] of [['iphone',devices['iPhone 13']],['small-phone',{...devices['iPhone SE']}],['desktop',{viewport:{width:1440,height:1000}}]]){
   for(const mode of ['normal','reduce','no-js']){
    const page=await browser.newPage({...device,javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference'});
    await page.addInitScript(()=>sessionStorage.setItem('mo-nl-toast-dismissed','1'));
    await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
    await page.goto(base,{waitUntil:'domcontentloaded'});
    const track=page.locator('.story-track'), region=page.locator('.story-marquee');
    const cards=page.locator('.story:not(.story-copy)');
    assert.equal(await cards.count(),9);
    assert.equal(await page.locator('#stories input').count(),0);
    for(let i=0;i<9;i++)assert.equal((await cards.nth(i).locator('.story-full').textContent()).trim(),'“'+testimonials[i].quote+'”');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(mode==='no-js'){
     assert.equal(await page.locator('.story-more:visible').count(),0);
     assert.equal(await page.locator('.story-copy:visible').count(),0);
     assert.equal(await track.evaluate(e=>getComputedStyle(e).animationName),'none');
     assert.equal(await cards.first().locator('.story-full').isVisible(),true);
    }else{
     const card=cards.first(), button=card.locator('.story-more');
     assert.equal(await card.locator('.story-full').isVisible(),false);
     if(mode==='reduce') assert.equal(await track.evaluate(e=>getComputedStyle(e).animationName),'none');
     await region.evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-110,behavior:"instant"}));
     if(label==='desktop'){
      await region.hover();
      assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
      await button.click();
     }else{
      assert.equal(await page.evaluate(()=>navigator.maxTouchPoints>0),true);
      const r=await button.boundingBox();
      await page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);
     }
     await page.screenshot({path:path.join(out,`${name}-${label}-${mode}-aftertap.png`)});
     assert.equal(await button.getAttribute('aria-expanded'),'true');
     assert.equal(await card.locator('.story-full').isVisible(),true);
     assert.equal(await region.getAttribute('data-reading'),'true');
     assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
     assert.equal(await card.evaluate(e=>{const r=e.getBoundingClientRect(),p=e.closest('.story-marquee').getBoundingClientRect();return r.left>=p.left-1&&r.right<=p.right+1&&e.scrollHeight<=e.clientHeight+1}),true);
     const x=await card.evaluate(e=>e.getBoundingClientRect().x);await page.waitForTimeout(400);assert.ok(Math.abs(await card.evaluate(e=>e.getBoundingClientRect().x)-x)<1);
     if(mode==='normal') await region.screenshot({path:path.join(out,`${name}-${label}-expanded.png`),style:'#site-nav, #nl-toast, nav {visibility:hidden!important}'});
     // Focused keyboard controls and touch read-less are tested separately.
     if(label==='desktop'){await button.focus();await page.keyboard.press('Enter');}
     else {await button.scrollIntoViewIfNeeded();const r=await button.boundingBox();await page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);}
     assert.equal(await button.getAttribute('aria-expanded'),'false');
     assert.equal(await card.locator('.story-full').isVisible(),false);
    }
    console.log(`PASS ${name} ${label} ${mode}`);await page.close();
   }
  }}finally{await browser.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
