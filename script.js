<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>IOE NATIVE Portal</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
</head>
<body>
    <div id="particles-js"></div>

    <div class="container">
        <h1 class="main-title">IOE NATIVE</h1>

        <div class="login-box">
            <div id="register-form">
                <div class="input-group">
                    <input type="text" id="reg-name" placeholder="FULL NAME" required>
                </div>
                <div class="input-group">
                    <input type="email" id="reg-email" placeholder="EMAIL ADDRESS" required>
                </div>
                <div class="input-group">
                    <input type="password" id="reg-pass" placeholder="PASSWORD" required>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="handleRegister()">SIGN UP</button>
                    <button class="btn btn-outline" onclick="toggleForm()">LOGIN</button>
                </div>
            </div>

            <div id="login-form" style="display: none;">
                <div class="input-group">
                    <input type="text" placeholder="EMAIL">
                </div>
                <div class="input-group">
                    <input type="password" placeholder="PASSWORD">
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="alert('Access Denied')">LOGIN</button>
                    <button class="btn btn-outline" onclick="toggleForm()">SIGN UP</button>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
