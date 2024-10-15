const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cmsdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Schema for CMS items
const cmsSchema = new mongoose.Schema({
    elementId: String,   // ID of the element being customized (e.g., header, button)
    content: String,     // Content to be displayed (text)
    styles: Object       // JSON object to store CSS styles (e.g., { backgroundColor: '#f00', width: '100px' })
});

const CmsItem = mongoose.model('CmsItem', cmsSchema);

// Route to get all CMS items
app.get('/api/cms', async (req, res) => {
    const cmsItems = await CmsItem.find({});
    res.json(cmsItems);
});

// Route to update a specific CMS item
app.post('/api/cms', async (req, res) => {
    const { elementId, content, styles } = req.body;
    let cmsItem = await CmsItem.findOne({ elementId });

    if (cmsItem) {
        cmsItem.content = content;
        cmsItem.styles = styles;
        await cmsItem.save();
    } else {
        cmsItem = new CmsItem({ elementId, content, styles });
        await cmsItem.save();
    }

    res.json(cmsItem);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
