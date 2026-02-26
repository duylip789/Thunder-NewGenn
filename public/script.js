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

// 3. Xử lý Đăng nhập (KIỂM TRA TỪ SHEETDB)
async function doLogin() {
    const emailInput = document.getElementById('login-email').value;
    const passInput = document.getElementById('login-pass').value;

    if (!emailInput || !passInput) {
        alert("Please fill in login details.");
        return;
    }

    try {
        // Tìm kiếm user có email này trong database
        const response = await fetch(`https://sheetdb.io/api/v1/nfvpng9qwtmvt/search?email=${encodeURIComponent(emailInput)}`);
        const users = await response.json();

        if (users.length > 0) {
            // Nếu tìm thấy email, kiểm tra password (cột password trong sheet)
            const user = users[0];
            if (user.password === passInput) {
                alert("Login Successful!");
                // Dòng này thực hiện chuyển trang đến index1.html
                window.location.href = "index1.html";
            } else {
                alert("Wrong password!");
            }
        } else {
            alert("Account does not exist. Please register.");
        }
    } catch (e) {
        alert("Login system error!");
        console.error(e);
    }
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
