const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();

app.use(express.json());

// 1. Cấu hình đường dẫn tuyệt đối cho thư mục public
// Dùng path.resolve giúp tránh lỗi ENOENT trên các server Linux như Render
const publicPath = path.resolve(__dirname, 'public');

// Phục vụ các file tĩnh (css, js, images) trong folder public
app.use(express.static(publicPath));

// 2. Định nghĩa Route chính xác
// TRANG CHỦ (Giao diện Login/Menu)
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// TRANG ĐIỀU KHIỂN (Giao diện Tool Bot)
app.get('/tool', (req, res) => {
    res.sendFile(path.join(publicPath, 'index1.html'));
});

// 3. API CHẠY BOT (Thêm các cấu hình tối ưu cho Render)
app.post('/run-bot', async (req, res) => {
    const { url } = req.body;
    let browser;
    try {
        console.log(`[BOT]: Đang truy cập ${url}`);
        browser = await puppeteer.launch({
            // Cấu hình bắt buộc để Puppeteer chạy được trên Docker/Render
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process'
            ],
            headless: "new"
        });
        
        const page = await browser.newPage();
        
        // Giả lập trình duyệt thật để tránh bị IOE chặn
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        
        // Tăng timeout lên 60s vì Render bản free đôi khi load hơi chậm
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        const questions = await page.evaluate(() => {
            // Quét tất cả các class có khả năng chứa câu hỏi của IOE
            const items = document.querySelectorAll('.question-content, .content-question, #divQuestion'); 
            return Array.from(items).map(el => el.innerText.trim());
        });

        await browser.close();
        res.json({ success: true, questions: questions });
    } catch (error) {
        if (browser) await browser.close();
        console.error(`[ERR]: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Lắng nghe Port (Render sẽ tự cấp cổng qua biến PORT)
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================`);
    console.log(`🚀 SERVER ĐÃ CHẠY TẠI PORT: ${PORT}`);
    console.log(`====================================`);
});
