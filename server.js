const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Key của bạn
const genAI = new GoogleGenerativeAI("AIzaSyD-Npu4679JQ-aIhiv9IdRZjt69R7k6ydM");

async function getAiAnswer(question, options) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Question: ${question}\nOptions: ${options.map((opt, i) => i + ": " + opt).join(", ")}\nReturn only the index number of correct answer.`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const match = text.match(/\d/);
        return match ? parseInt(match[0]) : 0;
    } catch (e) {
        console.log("⚠️ Lỗi AI (Có thể do vùng địa lý hoặc Key):", e.message);
        return 0; // Trả về đáp án đầu tiên nếu AI lỗi để tránh sập server
    }
}

app.post('/run-bot', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: "Thiếu URL!" });

    let browser;
    try {
        console.log(`[1/4] Đang mở trình duyệt...`);
        browser = await puppeteer.launch({
            // Sửa đường dẫn executablePath tự động để tránh lỗi 500
            executablePath: puppeteer.executablePath(),
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process'
            ],
            headless: "new"
        });

        const page = await browser.newPage();
        // Giới hạn tài nguyên để không bị Render kill (Tắt tải ảnh cho nhẹ)
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'font', 'media'].includes(req.resourceType())) req.abort();
            else req.continue();
        });

        console.log(`[2/4] Đang truy cập IOE: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        console.log(`[3/4] Đang quét câu hỏi...`);
        const quizData = await page.evaluate(() => {
            const items = document.querySelectorAll('.question-item, .content-question, .item-question, .box-cau-hoi'); 
            return Array.from(items).map(el => ({
                question: el.innerText.split('\n')[0], // Lấy dòng đầu tiên làm câu hỏi
                options: Array.from(el.querySelectorAll('.answer-item, .option-item, .ans-item, button')).map(opt => opt.innerText.trim())
            })).filter(q => q.options.length > 0);
        });

        console.log(`[BOT] Tìm thấy ${quizData.length} câu hỏi.`);

        if (quizData.length === 0) {
            throw new Error("Không tìm thấy câu hỏi nào. Có thể sai Link hoặc sai Class HTML.");
        }

        for (let i = 0; i < quizData.length; i++) {
            const item = quizData[i];
            const bestIdx = await getAiAnswer(item.question, item.options);
            console.log(`[AI] Câu ${i+1}: Chọn ${bestIdx}`);

            await page.evaluate((idx) => {
                const buttons = document.querySelectorAll('.answer-item, .option-item, .ans-item, button');
                if(buttons[idx]) buttons[idx].click();
            }, bestIdx);
            
            await new Promise(r => setTimeout(r, 1000)); 
        }

        console.log(`[4/4] Hoàn thành!`);
        await browser.close();
        res.json({ success: true, message: "Bot đã làm xong!" });

    } catch (error) {
        console.error("❌ LỖI RỒI:", error.message);
        if (browser) await browser.close();
        // Trả về lỗi cụ thể để Client biết
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server Ready on Port ${PORT}`));
