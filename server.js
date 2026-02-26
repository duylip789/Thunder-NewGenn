const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Thư viện AI của Google

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CẤU HÌNH AI VỚI KEY CỦA BẠN
const genAI = new GoogleGenerativeAI("AIzaSyD-Npu4679JQ-aIhiv9IdRZjt69R7k6ydM");

async function getAiAnswer(question, options) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an English teacher. 
        Question: ${question}
        Options: ${options.map((opt, i) => i + ": " + opt).join(", ")}
        Task: Return ONLY the number (0, 1, 2, or 3) of the correct answer. No explanation.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const match = text.match(/\d/);
        return match ? parseInt(match[0]) : 0;
    } catch (e) {
        console.log("Lỗi AI:", e.message);
        return 0;
    }
}

app.post('/run-bot', async (req, res) => {
    const { url } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            headless: "new"
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Lấy danh sách câu hỏi và đáp án từ trang web
        const quizData = await page.evaluate(() => {
            const items = document.querySelectorAll('.question-item'); // Hãy check lại class này trên IOE
            return Array.from(items).map(el => ({
                question: el.querySelector('.question-content')?.innerText.trim(),
                options: Array.from(el.querySelectorAll('.answer-item')).map(opt => opt.innerText.trim())
            }));
        });

        // AI giải và Bot tự Click
        for (const item of quizData) {
            if (item.question && item.options.length > 0) {
                const bestIdx = await getAiAnswer(item.question, item.options);
                
                // Click vào đáp án trên trình duyệt ngầm
                await page.evaluate((idx) => {
                    const buttons = document.querySelectorAll('.answer-item');
                    if(buttons[idx]) buttons[idx].click();
                }, bestIdx);
                
                await new Promise(r => setTimeout(r, 1000)); // Nghỉ 1s cho an toàn
            }
        }

        await browser.close();
        res.json({ success: true, message: "Bot đã hoàn thành bài thi với AI!" });
    } catch (error) {
        if (browser) await browser.close();
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
