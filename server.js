const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// TRANG CHỦ (Giao diện Login/Menu)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// TRANG ĐIỀU KHIỂN (Giao diện Tool Bot)
app.get('/tool', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

// API CHẠY BOT (Giữ nguyên như cũ)
app.post('/run-bot', async (req, res) => {
    const { url } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: "new"
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const questions = await page.evaluate(() => {
            const items = document.querySelectorAll('.question-content'); 
            return Array.from(items).map(el => el.innerText.trim());
        });
        await browser.close();
        res.json({ success: true, questions: questions });
    } catch (error) {
        if (browser) await browser.close();
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
