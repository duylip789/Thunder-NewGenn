const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CẤU HÌNH AI
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
    if (!url) return res.status(400).json({ success: false, error: "Thiếu URL bài thi!" });

    let browser;
    try {
        console.log(`[SYS] Đang khởi động trình duyệt...`);
        
        // SỬA ĐOẠN NÀY ĐỂ FIX LỖI "NO EXECUTABLE FOUND"
        browser = await puppeteer.launch({
            // Trên Render, Puppeteer sẽ tải Chromium vào thư mục /home/render/.cache/...
            // Chúng ta không set executablePath để nó tự động dùng bản đã cài qua render-build.sh
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--single-process',
                '--no-zygote'
            ],
            headless: "new"
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        
        // Tăng timeout vì máy chủ Render Free cần thời gian khởi động Chrome
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

        const quizData = await page.evaluate(() => {
            const items = document.querySelectorAll('.question-item, .content-question, .item-question'); 
            return Array.from(items).map(el => ({
                question: el.querySelector('.question-content, .title-question, .content-question')?.innerText.trim(),
                options: Array.from(el.querySelectorAll('.answer-item, .option-item, .ans-item')).map(opt => opt.innerText.trim())
            }));
        });

        console.log(`[BOT] Tìm thấy ${quizData.length} câu hỏi.`);

        for (const item of quizData) {
            if (item.question && item.options.length > 0) {
                const bestIdx = await getAiAnswer(item.question, item.options);
                console.log(`[AI] Giải câu: ${item.question.substring(0, 20)}... -> Đáp án: ${bestIdx}`);

                await page.evaluate((idx) => {
                    const buttons = document.querySelectorAll('.answer-item, .option-item, .ans-item');
                    if(buttons[idx]) {
                        buttons[idx].click();
                        return true;
                    }
                    return false;
                }, bestIdx);
                
                await new Promise(r => setTimeout(r, 1500)); 
            }
        }

        await browser.close();
        res.json({ success: true, message: "Bot đã hoàn thành bài thi với AI!" });

    } catch (error) {
        console.error("[ERR]", error.message);
        if (browser) await browser.close();
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================`);
    console.log(`🚀 SERVER ĐÃ CHẠY TẠI PORT: ${PORT}`);
    console.log(`====================================`);
});
