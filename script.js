// Cấu hình hiệu ứng tia sét kết nối
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 100 },
    "color": { "value": "#00ff41" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5 },
    "size": { "value": 3 },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#00ff41",
      "opacity": 0.4,
      "width": 1
    },
    "move": { "enable": true, "speed": 3 }
  },
  "interactivity": {
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" }
    }
  }
});

function toggleForm() {
    const login = document.getElementById('login-form');
    const register = document.getElementById('register-form');
    if (login.style.display === "none") {
        login.style.display = "block";
        register.style.display = "none";
    } else {
        login.style.display = "none";
        register.style.display = "block";
    }
}

async function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    if (!name || !email || !password) {
        alert("CRITICAL ERROR: Data missing!");
        return;
    }

    const btn = document.querySelector('#register-form .btn-primary');
    btn.innerText = "UPLOADING...";
    btn.disabled = true;

    try {
        const response = await fetch('https://sheetdb.io/api/v1/nfvpng9qwtmvt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [{ "name": name, "email": email, "password": password }] })
        });

        if (response.ok) {
            alert("ACCESS GRANTED: User encrypted in database!");
            toggleForm();
        }
    } catch (e) {
        alert("SYSTEM BREACH: Failed to connect!");
    } finally {
        btn.innerText = "INITIALIZE";
        btn.disabled = false;
    }
}
