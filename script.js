const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Scroll: add shadow + track active section
window.addEventListener('scroll', () => {
    // Navbar shadow on scroll
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile hamburger toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});


// ===========================
//  SCROLL REVEAL ANIMATION
// ===========================
const fadeEls = document.querySelectorAll('.card, .section-header, .form-wrapper');

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

fadeEls.forEach(el => observer.observe(el));


// ===========================
//  FORM VALIDATION & SUBMIT
// ===========================
const form = document.getElementById('registrationForm');
const successMsg = document.getElementById('successMsg');
const resetBtn = document.getElementById('resetBtn');
const submitBtn = document.getElementById('submitBtn');
const btnLoader = document.getElementById('btnLoader');
const btnText = submitBtn.querySelector('.btn-text');

// Field references
const fields = {
    fullName: {
        el: document.getElementById('fullName'),
        error: document.getElementById('nameError'),
        validate: (val) => val.trim().length >= 3,
    },
    email: {
        el: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    },
    phone: {
        el: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: (val) => /^[6-9]\d{9}$/.test(val.trim()),
    },
    domain: {
        el: document.getElementById('domain'),
        error: document.getElementById('domainError'),
        validate: (val) => val !== '',
    },
    level: {
        el: document.getElementById('level'),
        error: document.getElementById('levelError'),
        validate: (val) => val !== '',
    },
    college: {
        el: document.getElementById('college'),
        error: document.getElementById('collegeError'),
        validate: (val) => val.trim().length >= 3,
    },
};

const portfolioEl = document.getElementById('portfolio');
const portfolioError = document.getElementById('portfolioError');
const termsEl = document.getElementById('terms');
const termsError = document.getElementById('termsError');

// Validate a single field and apply styles
function validateField(key) {
    const field = fields[key];
    const val = field.el.value;
    const isValid = field.validate(val);

    field.el.classList.toggle('error', !isValid);
    field.el.classList.toggle('success', isValid);
    field.error.classList.toggle('visible', !isValid);

    return isValid;
}

// Portfolio URL — optional, validate only if filled
function validatePortfolio() {
    const val = portfolioEl.value.trim();
    if (val === '') {
        portfolioEl.classList.remove('error', 'success');
        portfolioError.classList.remove('visible');
        return true; // optional field
    }
    const isValid = /^https?:\/\/.+\..+/.test(val);
    portfolioEl.classList.toggle('error', !isValid);
    portfolioEl.classList.toggle('success', isValid);
    portfolioError.classList.toggle('visible', !isValid);
    return isValid;
}

// Terms checkbox
function validateTerms() {
    const checked = termsEl.checked;
    termsError.classList.toggle('visible', !checked);
    return checked;
}

// Real-time validation on blur
Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) validateField(key);
    });
});

portfolioEl.addEventListener('blur', validatePortfolio);
portfolioEl.addEventListener('input', validatePortfolio);
termsEl.addEventListener('change', validateTerms);

// Form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;

    Object.keys(fields).forEach(key => {
        if (!validateField(key)) isFormValid = false;
    });

    if (!validatePortfolio()) isFormValid = false;
    if (!validateTerms()) isFormValid = false;

    if (!isFormValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            firstError.focus();
        }
        return;
    }

    // Simulate loading
    btnText.textContent = 'Submitting...';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.add('visible');
    }, 1800);
});

// Reset form
resetBtn.addEventListener('click', () => {
    form.reset();

    // Clear validation classes
    Object.keys(fields).forEach(key => {
        fields[key].el.classList.remove('error', 'success');
        fields[key].error.classList.remove('visible');
    });

    portfolioEl.classList.remove('error', 'success');
    portfolioError.classList.remove('visible');
    termsError.classList.remove('visible');

    btnText.textContent = 'Submit Application';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;

    form.style.display = 'block';
    successMsg.classList.remove('visible');
});


// ===========================
//  SMOOTH SCROLL FOR ANCHORS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    });
});
