const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());


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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

