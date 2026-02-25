// 1. Khởi tạo mạng lưới particles
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 90, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#00ff88" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5 },
        "size": { "value": 2 },
        "line_linked": { "enable": true, "distance": 150, "color": "#00ff88", "opacity": 0.3, "width": 1 },
        "move": { "enable": true, "speed": 2 }
    },
    "interactivity": {
        "events": { "onhover": { "enable": true, "mode": "grab" } }
    }
});

// 2. Chuyển đổi giữa Login và Register
function swap() {
    const reg = document.getElementById('reg-area');
    const log = document.getElementById('log-area');
    if (log.style.display === "none") {
        log.style.display = "block";
        reg.style.display = "none";
    } else {
        log.style.display = "none";
        reg.style.display = "block";
    }
}

// 3. XỬ LÝ ĐĂNG NHẬP (KIỂM TRA DATABASE THẬT)
async function doLogin() {
    // Lấy thông tin từ các ô input trong log-area (Dùng querySelector để chính xác)
    const emailInput = document.querySelector('#log-area input[type="text"]').value;
    const passInput = document.querySelector('#log-area input[type="password"]').value;

    if (!emailInput || !passInput) {
        alert("Please enter email and password.");
        return;
    }

    try {
        // Gọi API SheetDB để tìm kiếm user có email này
        // Lưu ý: Dùng /search để lọc cho nhanh
        const response = await fetch(`https://sheetdb.io/api/v1/nfvpng9qwtmvt/search?email=${emailInput}`);
        const users = await response.json();

        if (users.length > 0) {
            // Tìm thấy email, giờ kiểm tra mật khẩu
            const user = users[0];
            if (user.password === passInput) {
                alert("Login successful!");
                // DÒNG CHUYỂN HƯỚNG ĐÂY:
                window.location.href = "index1.html";
            } else {
                alert("Incorrect password!");
            }
        } else {
            alert("Email not found! Please register first.");
        }
    } catch (e) {
        console.error(e);
        alert("System error! Please try again later.");
    }
}

// 4. Xử lý đăng ký (Giữ nguyên của bạn)
async function doRegister() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    if (!name || !email || !pass) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('https://sheetdb.io/api/v1/nfvpng9qwtmvt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [{ name, email, password: pass }] })
        });
        if (response.ok) {
            alert("Account created successfully!");
            swap(); // Quay lại login
        }
    } catch (e) {
        alert("System error!");
    }
}
