const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const app = express();

// Port configuration for local and Heroku environments
const port = process.env.PORT || 4000;

// CORS Middleware for handling cross-origin requests
app.use(cors());

// Endpoint for web scraping
app.get('/scrape', (req, res) => {
    // Execute the Python script. On Heroku, Python environment is managed, so no need for venv path
    exec(`python3 ${path.join(__dirname, 'scraper.py')}`, (error, stdout, stderr) => {
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
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../my-app/build')));

// The "catchall" handler to serve the React app's index.html for any request that isn't to the API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../my-app/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
