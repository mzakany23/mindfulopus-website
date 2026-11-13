const BASE=process.env.BASE_URL || 'http://192.168.68.133:8877';
const assert=require('node:assert/strict');
const {chromium,devices}=require('playwright');
const {testimonials}=require('../src/data/testimonials.json');
(async()=>{const b=await chromium.launch();try{for(const device of ['iPhone 13','iPhone SE']){
 const p=await b.newPage({...devices[device]});
 await p.addInitScript(()=>sessionStorage.setItem('mo-nl-toast-dismissed','1'));
 await p.route('**/*',r=>r.request().url().startsWith(BASE)?r.continue():r.abort());
 await p.goto(BASE,{waitUntil:'domcontentloaded'});
 const reg=p.locator('.story-marquee'),cards=p.locator('.story:not(.story-copy)');
 await reg.evaluate(e=>window.scrollTo({top:scrollY+e.getBoundingClientRect().top-110,behavior:'instant'}));
 const tapCard=async()=>{const r=await reg.boundingBox();await p.touchscreen.tap(r.x+80,r.y+50)};
 const pos=()=>reg.evaluate(e=>e.scrollLeft);
 await tapCard();assert.equal(await reg.getAttribute('data-paused'),'true');const x=await pos();await p.waitForTimeout(400);assert.ok(Math.abs(await pos()-x)<1);
 await tapCard();assert.equal(await reg.getAttribute('data-paused'),'false');const y=await pos();await p.waitForTimeout(400);assert.ok(await pos()>y+5);
 await tapCard();
 const heights=await cards.evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));
 await reg.evaluate(e=>e.scrollLeft=0);
 const button=cards.first().locator('button');const br=await button.boundingBox();await p.touchscreen.tap(br.x+br.width/2,br.y+br.height/2);
 assert.equal(await button.getAttribute('aria-expanded'),'true');assert.equal(await reg.getAttribute('data-paused'),'true');
 assert.equal(await p.locator('.story-more[aria-expanded=true]').count(),1);
 assert.equal((await cards.first().locator('.story-full').innerText()).trim(),'“'+testimonials[0].quote+'”');
 const nextHeights=await cards.evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));assert.ok(nextHeights[0]>heights[0]);assert.deepEqual(nextHeights.slice(1),heights.slice(1));
 await p.screenshot({path:`/tmp/lan-${device}-expanded-viewport.png`});
 await reg.screenshot({path:`/tmp/lan-${device}-expanded-section.png`,style:'nav,#nl-toast{visibility:hidden!important}'});
 // Real native Chromium touch drag, not a programmatic scrollLeft assignment.
 await reg.evaluate(e=>window.scrollTo({top:scrollY+e.getBoundingClientRect().top-110,behavior:'instant'}));
 const cdp=await p.context().newCDPSession(p),r=await reg.boundingBox(),startX=r.x+r.width-30,startY=r.y+70;const before=await pos();
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:startX,y:startY}]});
 for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:startX-i*22,y:startY}]});await p.waitForTimeout(30)}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(600);assert.ok(await pos()>before+60,'thumb swipe moves carousel');assert.equal(await reg.getAttribute('data-paused'),'true');
 await tapCard();assert.equal(await reg.getAttribute('data-paused'),'false');const z=await pos();await p.waitForTimeout(400);assert.ok(await pos()>z+5,'tap resumes after swipe without outside tap');
 console.log('PASS',device,'tap stop/start, swipe, resume, selected-only expansion, full text, independent heights');await p.close();
 }}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
