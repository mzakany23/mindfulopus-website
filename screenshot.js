const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport sizes to test responsiveness
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
  ];
  
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:8888', { waitUntil: 'networkidle' });
    
    // Full page screenshot
    await page.screenshot({ 
      path: `screenshots/homepage-${viewport.name}-full.png`,
      fullPage: true 
    });
    
    // Viewport height screenshot
    await page.screenshot({ 
      path: `screenshots/homepage-${viewport.name}.png`
    });
    
    console.log(`✓ Screenshots taken for ${viewport.name} (${viewport.width}x${viewport.height})`);
  }
  
  await browser.close();
  console.log('Done!');
})();
