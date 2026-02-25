/* script.js */

// 1. Kích hoạt mạng lưới tia sét
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#00ff88" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5 },
        "size": { "value": 2 },
        "line_linked": { 
            "enable": true, 
            "distance": 150, 
            "color": "#00ff88", 
            "opacity": 0.4, 
            "width": 1 
        },
        "move": { "enable": true, "speed": 2.5 }
    },
    "interactivity": {
        "events": { "onhover": { "enable": true, "mode": "grab" } }
    }
});

// 2. Chuyển đổi Form
function swap() {
    const r = document.getElementById('reg-area');
    const l = document.getElementById('log-area');
    r.style.display = (r.style.display === 'none') ? 'block' : 'none';
    l.style.display = (l.style.display === 'none') ? 'block' : 'none';
}

// 3. Gửi dữ liệu về SheetDB
async function doRegister() {
    const n = document.getElementById('name').value;
    const e = document.getElementById('email').value;
    const p = document.getElementById('pass').value;

    if (!n || !e || !p) return alert("Vui lòng nhập đủ thông tin!");

    try {
        const res = await fetch('https://sheetdb.io/api/v1/nfvpng9qwtmvt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [{ name: n, email: e, password: p }] })
        });
        if (res.ok) {
            alert("ĐĂNG KÝ THÀNH CÔNG!");
            swap();
        }
    } catch (err) {
        alert("Lỗi kết nối database!");
    }
}
