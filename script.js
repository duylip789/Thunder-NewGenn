// 1. Hàm chuyển đổi qua lại giữa Đăng nhập và Đăng ký
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

// 2. Hàm xử lý Đăng ký và gửi dữ liệu lên Google Sheets
async function handleRegister() {
    // Lấy giá trị từ các ô input
    const name = document.querySelector('input[placeholder="Họ và tên"]').value;
    const email = document.querySelector('input[placeholder="Địa chỉ Email"]').value;
    const password = document.querySelector('input[placeholder="Mật khẩu mới"]').value;

    // Kiểm tra xem có ô nào bị bỏ trống không
    if (!name || !email || !password) {
        alert("Vui lòng điền đầy đủ thông tin bạn nhé!");
        return;
    }

    // Hiệu ứng nút bấm khi đang xử lý
    const btn = document.querySelector('#register-form button');
    const originalText = btn.innerText;
    btn.innerText = "Đang xử lý...";
    btn.disabled = true;

    try {
        // Gửi dữ liệu đến SheetDB (Link của bạn đã được dán ở đây)
        const response = await fetch('https://sheetdb.io/api/v1/nfvpng9qwtmvt', {
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
            alert("Đăng ký thành công! Bạn có thể kiểm tra Google Sheets ngay.");
            // Xóa sạch dữ liệu cũ trong ô nhập
            document.querySelectorAll('input').forEach(input => input.value = '');
            // Quay về màn hình đăng nhập
            toggleForm();
        } else {
            alert("Có lỗi xảy ra khi gửi dữ liệu!");
        }
    } catch (error) {
        alert("Không thể kết nối với máy chủ. Kiểm tra mạng xem sao!");
        console.error(error);
    } finally {
        // Trả lại trạng thái nút bấm ban đầu
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
