const { browser } = require('vibium');

async function run() {
    console.log("1. Attempting to start the browser...");
    
    // Minimal configuration to check the handshake
    const bro = await browser.start({ 
        headless: true 
    });

    // If the library receives the "ready" signal, it will hit this line
    console.log("2. Browser process confirmed!");
    
    console.log("3. Shutting down...");
    await bro.stop();
    console.log("4. Clean exit.");
}

run().catch(err => {
    console.error("❌ Node.js Bridge Error:");
    console.error(err.message);
});