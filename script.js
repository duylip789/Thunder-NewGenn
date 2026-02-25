function toggleForm() {
    const login = document.getElementById('login-form');
    const register = document.getElementById('register-form');
    
    // Đảm bảo style display được thiết lập rõ ràng
    if (register.style.display === "none" || register.style.display === "") {
        login.style.display = "none";
        register.style.display = "block";
    } else {
        login.style.display = "block";
        register.style.display = "none";
    }
}

async function handleRegister() {
    // 1. Lấy đúng các ô input bên trong khối register-form để tránh nhầm với form login
    const regForm = document.getElementById('register-form');
    const nameInput = regForm.querySelector('input[type="text"]');
    const emailInput = regForm.querySelector('input[type="email"]');
    // Lấy ô mật khẩu đầu tiên trong form đăng ký
    const passwordInput = regForm.querySelector('input[type="password"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // 2. Kiểm tra dữ liệu
    if (!name || !email || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // 3. Vô hiệu hóa nút bấm
    const btn = regForm.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Đang gửi dữ liệu...";
    btn.disabled = true;

    try {
        const apiURL = 'https://sheetdb.io/api/v1/nfvpng9qwtmvt';
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [
                    {
                        "name": name,
                        "email": email,
                        "password": password
                    }
                ]
            })
        });

        if (response.ok) {
            alert("Đăng ký thành công!");
            // Xóa trắng ô nhập
            nameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            // Quay về form đăng nhập
            toggleForm();
        } else {
            const errorData = await response.json();
            alert("Lỗi từ server: " + (errorData.error || "Không xác định"));
        }
    } catch (error) {
        alert("Lỗi kết nối mạng hoặc sai link API!");
        console.error("Chi tiết lỗi:", error);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
