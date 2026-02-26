const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Để chạy giao diện HTML

app.post('/run-bot', async (req, res) => {
    const { url } = req.body;
    
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: "new"
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // LẤY CÂU HỎI THẬT TỪ IOE
        const questions = await page.evaluate(() => {
            const items = document.querySelectorAll('.question-content'); 
            return Array.from(items).map(el => el.innerText.trim());
        });

        // Giả lập AI giải và tích đáp án (Bạn có thể thêm API ChatGPT ở đây)
        await page.click('.answer-item'); // Tự tích câu đầu tiên làm mẫu
        
        await browser.close();
        res.json({ success: true, questions: questions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
