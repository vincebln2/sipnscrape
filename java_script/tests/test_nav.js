const { browser } = require('vibium');

async function test() {
    console.log("🚀 Starting browser...");
    const bro = await browser.start({ headless: true });
    
    // Create the page object
    const page = await bro.page();
    
    // THE FIX: Wait 2 seconds for the "pipe" handshake to settle 
    // before sending a navigation command.
    console.log("⏳ Stabilizing connection...");
    await new Promise(r => setTimeout(r, 2000));

    const url = "https://example.com";
    console.log(`🌐 Navigating to ${url}...`);
    
    try {
        await page.go(url);
        
        // If we get here, navigation worked!
        const title = await page.evaluate(() => document.title);
        console.log(`✅ Success! Page title is: "${title}"`);
    } catch (err) {
        console.error("❌ Navigation failed:", err.message);
    }

    await bro.stop();
    console.log("🏁 Test complete.");
}

test().catch(console.error);