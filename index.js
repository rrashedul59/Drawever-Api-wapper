const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function processImageAndUpload(buffer) {
    try {
        const base64String = Buffer.from(buffer, 'binary').toString('base64');

      
        const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
            data: `data:image/png;base64,${base64String}`,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const processedImageUrl = 'https://www.drawever.com' + (apiResponse.data.urls[1] || apiResponse.data.urls[0]);

        return processedImageUrl;
    } catch (error) {
        throw error;
    }
}

app.get('/draw', async (req, res) => {
    try {
        const imageUrl = req.query.imgurl;

        
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });

      
        const processedImageUrl = await processImageAndUpload(imageResponse.data);

        res.json({ processedImageUrl });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// api source code by Samir Œ I appreciate if you don't remove the comments endpoint is /draw?imgurl= I hope this helps you 
