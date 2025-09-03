// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Make functions global so onclick can access them
    window.showSignIn = function() {
        console.log('Switching to Sign In'); // Debug log
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.toggle-btn:first-child').classList.add('active');
        
        // Switch forms
        document.getElementById('signInForm').classList.remove('hidden');
        document.getElementById('signUpForm').classList.add('hidden');
        
        // Update left panel content
        const authLeft = document.getElementById('authLeft');
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeSubtitle = document.getElementById('welcomeSubtitle');
        
        authLeft.classList.remove('signup-mode');
        welcomeTitle.textContent = 'Welcome Back!';
        welcomeSubtitle.textContent = 'We\'ve missed you! Sign in to continue your food journey with us.';
    }

    window.showSignUp = function() {
        console.log('Switching to Sign Up'); // Debug log
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.toggle-btn:last-child').classList.add('active');
        
        // Switch forms
        document.getElementById('signUpForm').classList.remove('hidden');
        document.getElementById('signInForm').classList.add('hidden');
        
        // Update left panel content
        const authLeft = document.getElementById('authLeft');
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeSubtitle = document.getElementById('welcomeSubtitle');
        
        authLeft.classList.add('signup-mode');
        welcomeTitle.textContent = 'Join XIApee!'; // Updated to match your brand
        welcomeSubtitle.textContent = 'Create your account and discover amazing local restaurants and fresh ingredients delivered to your door.';
    }

    window.togglePassword = function(inputId) {
        const passwordInput = document.getElementById(inputId);
        const toggleBtn = passwordInput.nextElementSibling;
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
        }
    }

    // Sign In Form Handler
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('signInEmail').value;
            const password = document.getElementById('signInPassword').value;
            
            if (email && password) {
                const btn = this.querySelector('.auth-btn');
                btn.textContent = 'Signing In...';
                btn.style.background = '#999';
                
                setTimeout(() => {
                    alert('Welcome back! Sign in successful!');
                    btn.textContent = 'Sign In';
                    btn.style.background = 'linear-gradient(135deg, #4a7c59 0%, #6a9c7a 100%)';
                }, 2000);
            }
        });
    }

    // Sign Up Form Handler
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('signUpPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (!agreeTerms) {
                alert('Please agree to the Terms & Conditions');
                return;
            }
            
            const btn = this.querySelector('.auth-btn');
            btn.textContent = 'Creating Account...';
            btn.style.background = '#999';
            
            setTimeout(() => {
                alert('Account created successfully! Welcome to XIApee!'); // Updated brand name
                btn.textContent = 'Create Account';
                btn.style.background = 'linear-gradient(135deg, #4a7c59 0%, #6a9c7a 100%)';
            }, 2000);
        });
    }

    // Social Login Handlers
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.title.split(' ')[2];
            alert(`Continue with ${platform} - Feature coming soon!`);
        });
    });

    // Add focus effects to inputs
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

});