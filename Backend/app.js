const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const app = express();

// Port configuration for Heroku
const port = process.env.PORT || 4000;

// CORS Middleware
app.use(cors());

// Scraping endpoint
app.get('/scrape', (req, res) => {
    exec('python scraper.py', (error, stdout, stderr) => {
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
        if (error) {
            console.error('exec error:', error);
            return res.status(500).send('Error occurred while executing the script');
        }
        try {
            const data = JSON.parse(stdout);
            res.json(data); // Send the data as JSON
        } catch (parseError) {
            res.status(500).send('Error parsing script output');
        }
    });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../my-app/build')));

// The "catchall" handler: for any request that doesn't
// match the ones above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../my-app/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
