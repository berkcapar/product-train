// api/scrape.js
const { exec } = require('child_process');
const path = require('path');

module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Methods you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Request headers you wish to allow

    // Check if it's a pre-flight request and handle it
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Execute the Python script
    exec(`python3 ${path.join(__dirname, 'python-scraper.py')}`, (error, stdout, stderr) => {
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
        if (error) {
            console.error('exec error:', error);
            return res.status(500).send(`Error occurred while executing the script: ${error.message}`);
        }
        try {
            const data = JSON.parse(stdout);
            res.json(data); // Send the scraped data as JSON
        } catch (parseError) {
            console.error('parse error:', parseError);
            res.status(500).send(`Error parsing script output: ${parseError.message}`);
        }
    });
};

