const { execSync } = require('child_process');
const axios = require('axios');
const fs = require('fs');

/** @constant {string} Base URL for the FastAPI backend */
const API_URL = 'http://localhost:8000/beans/';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main scraper engine.
 * Orchestrates link discovery via curl and data extraction via Vibium.
 */
async function runEngine() {
    console.log("Checking all bean links...");

    try {
        const sources = JSON.parse(fs.readFileSync('./sources.json', 'utf8'));

        for (const source of sources) {
            console.log(`Identifying beans on ${source.roaster}...`);
            
            const urlObj = new URL(source.url);
            const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

            const curlCmd = `curl -sL "${source.url}"`;
            const mainHtml = execSync(curlCmd, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 2 });

            const linkRegex = /\/products\/[a-z0-9-]+(?=[/?"])/g;
            const matches = mainHtml.match(linkRegex) || [];
            
            const productUrls = [...new Set(matches)]
                .filter(path => !path.includes('gift-card') && path.length > 10)
                .map(path => `${baseUrl}${path}`);

            console.log(`Found ${productUrls.length} unique bean links.`);

            for (const beanUrl of productUrls) {
                try {
                    console.log(`Checking: ${beanUrl.split('/').pop()}`);
                    
                    execSync(`./node_modules/.bin/vibium go ${beanUrl} --headless`, { encoding: 'utf8' });

                    const titleDataRaw = execSync(`./node_modules/.bin/vibium go ${beanUrl} --headless --json`, { encoding: 'utf8' });
                    const titleData = JSON.parse(titleDataRaw);
                    
                    const rawTitle = titleData.title || "";
                    let beanName = "Unknown Bean";

                    if (rawTitle.includes('–') || rawTitle.includes('|') || rawTitle.includes(' - ')) {
                        beanName = rawTitle.split('–')[0].split('|')[0].split(' - ')[0].trim();
                    } else {
                        const slug = beanUrl.split('/').pop();
                        beanName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    }

                    const detailText = execSync(`./node_modules/.bin/vibium text ${beanUrl} --headless`, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 2 });
                    const lowerText = detailText.toLowerCase();

                    // --- IMPROVED ROAST DETECTION ---
                    let detectedRoast = 'Medium';
                    
                    // We check for "Light Roast" or specific Light indicators first
                    if (lowerText.includes('light roast') || lowerText.includes('light-medium')) {
                        detectedRoast = 'Light';
                    } else if (lowerText.includes('dark roast') || lowerText.includes('medium-dark')) {
                        detectedRoast = 'Dark';
                    } else if (lowerText.includes('medium roast')) {
                        detectedRoast = 'Medium';
                    } else {
                        // Fallback to simple keyword check if the specific phrase "X Roast" isn't found
                        if (lowerText.includes('light')) detectedRoast = 'Light';
                        else if (lowerText.includes('dark')) detectedRoast = 'Dark';
                    }

                    const lines = detailText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                    const nameIndex = lines.findIndex(l => l.includes(beanName));
                    const searchArea = nameIndex !== -1 ? lines.slice(nameIndex + 1, nameIndex + 10) : lines;

                    const tasteNotesLine = searchArea.find(l => 
                        (l.includes(',') || l.includes('&')) && 
                        l.length < 80 &&
                        !l.includes('©') && 
                        !l.includes('CATERING') &&
                        !l.includes('EVENTS') &&
                        !l.includes('SERVICES') &&
                        !l.includes('Shipping')
                    );

                    let notesArray = [];
                    if (tasteNotesLine) {
                        notesArray = tasteNotesLine.split(/[,&]+/).map(n => n.trim()).filter(n => n.length > 0);
                    }

                    const origins = ["GUATEMALA", "COSTA RICA", "HONDURAS", "ETHIOPIA", "COLOMBIA", "KENYA", "MEXICO", "BRAZIL", "WORLD TOUR", "SUMATRA", "VIETNAM"];

                    const beanData = {
                        name: beanName,
                        roaster: source.roaster,
                        hyperlink: beanUrl,
                        taste_notes: notesArray,
                        roast_type: detectedRoast,
                        process: detailText.match(/(Washed|Honey|Natural|Anaerobic)\s+Process/i)?.[1] || "Washed",
                        elevation: detailText.match(/(\d{1,3},?\d{3})\s+MASL/i)?.[1]?.replace(',', '') || null,
                        country: origins.find(o => beanName.toUpperCase().includes(o)) || "Blend",
                        vibe_score: 0.0 // Ensure this matches your model
                    };

                    await axios.post(API_URL, beanData);
                    console.log(`Synced: ${beanName} [Roast: ${detectedRoast}]`);

                } catch (err) {
                    console.error(`Error with ${beanUrl}:`, err.message);
                }
            }
        }
    } catch (err) {
        console.error("Engine Error:", err.message);
    }
    console.log("All tasks complete.");
}

runEngine();