// script.js
function toggleForm() {
    const login = document.getElementById('login-form');
    const register = document.getElementById('register-form');
    
    // Kiểm tra trạng thái hiển thị của form login
    if (login.style.display === "none") {
        // Nếu login đang ẩn -> Hiện login, ẩn register
        login.style.display = "block";
        register.style.display = "none";
    } else {
        // Nếu login đang hiện -> Ẩn login, hiện register
        login.style.display = "none";
        register.style.display = "block";
    }
}
