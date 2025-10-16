const registerBtn = document.getElementById('registerBtn');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const passwordConfirmError = document.getElementById('passwordConfirmError');


const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
})
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
})

registerBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let valid = true;
    emailError.textContent = '';
    passwordError.textContent = '';
    passwordConfirmError.textContent = '';
    successMessage.style.display = 'none';


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailError.textContent = 'Email harus berformat valid.';
        valid = false;
    }
    if (password.value.length < 8) {
        passwordError.textContent = 'Password Minimal 8 karakter.';
        valid = false;
    }
    if (password.value !== confirmPassword.value) {
        passwordConfirmError.textContent = 'Password tidak cocok.';
        valid = false;
    }
    if (valid) {
        successMessage.textContent = 'Berhasil Daftar';
        successMessage.style.display = 'block';

        email.value = '';
        password.value = '';
        confirmPassword.value = '';

    }
})
