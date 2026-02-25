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

// 3. XỬ LÝ ĐĂNG NHẬP (MỚI THÊM)
async function doLogin() {
    // Lấy giá trị từ các ô input trong log-area (Cần thêm ID vào HTML nếu chưa có)
    const email = document.querySelector('#log-area input[type="text"]').value;
    const pass = document.querySelector('#log-area input[type="password"]').value;

    if (!email || !pass) {
        alert("Vui lòng nhập Email và Mật khẩu!");
        return;
    }

    // Hiệu ứng giả lập đang kiểm tra
    console.log("Đang xác thực tài khoản...");
    
    // Ở đây bạn có thể thêm fetch để check tài khoản từ Database
    // Nhưng để chạy nhanh theo yêu cầu của bạn, mình sẽ cho chuyển hướng luôn:
    
    alert("Đăng nhập thành công!");
    window.location.href = "index1.html"; 
}

// 4. Xử lý đăng ký
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
