document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (sessionStorage.getItem('github_issue_tracker_auth') === 'true') {
        window.location.href = './index.html';
    }

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        void toast.offsetWidth;
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');

        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (usernameInput === 'admin' && passwordInput === 'admin123') {
            sessionStorage.setItem('github_issue_tracker_auth', 'true');
            window.location.href = './index.html';
        } else {
            showToast('Invalid credentials. Please use admin / admin123');
        }
    });
});
