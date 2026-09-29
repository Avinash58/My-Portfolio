// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// Smooth scrolling for navigation links
navLinksItems.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu
        if (navLinks) navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && hamburger && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Add stagger animation for children
            const children = entry.target.querySelectorAll('.list-item, .glass-square, .mini-card');
            children.forEach((child, index) => {
                child.style.animationDelay = `${index * 0.15}s`;
            });
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.list-item, .glass-square, .mini-card, .about-main-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    .navbar.scrolled .glass-nav {
        background: rgba(13, 9, 20, 0.9);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
`;
document.head.appendChild(style);

// Performance: Debounce scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');
    
    // Add a subtle entrance animation to the body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '1';
    }, 100);

    // ===========================
    // RESUME MODAL
    // ===========================
    const resumeNavBtn  = document.getElementById('resumeNavBtn');
    const viewResumeBtn = document.getElementById('viewResumeBtn');
    const resumeModal   = document.getElementById('resumeModal');
    const resumeClose   = document.getElementById('resumeClose');
    const resumeOverlay = document.getElementById('resumeOverlay');

    function openResumeModal() {
        if (resumeModal) {
            resumeModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeResumeModal() {
        if (resumeModal) {
            resumeModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (resumeNavBtn)  resumeNavBtn.addEventListener('click',  (e) => { e.preventDefault(); openResumeModal(); });
    if (viewResumeBtn) viewResumeBtn.addEventListener('click', openResumeModal);
    if (resumeClose)   resumeClose.addEventListener('click',   closeResumeModal);
    if (resumeOverlay) resumeOverlay.addEventListener('click', closeResumeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('open')) {
            closeResumeModal();
        }
    });
});


// =============================================
// CUSTOM CURSOR — dot + trailing ring + trail
// =============================================
(function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = -200, mouseY = -200;
    let ringX  = -200, ringY  = -200;
    let lastTrailX = -999, lastTrailY = -999;

    // Move dot instantly with the mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';

        // Spawn trail dot every ~60px of movement
        const dist = Math.hypot(mouseX - lastTrailX, mouseY - lastTrailY);
        if (dist > 55) {
            spawnTrail(mouseX, mouseY);
            lastTrailX = mouseX;
            lastTrailY = mouseY;
        }
    });

    // Ring follows with smooth lerp (lag effect)
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Attach hover state after DOM is ready
    function attachHoverTargets() {
        const hoverTargets = document.querySelectorAll(
            'a, button, [role="button"], .mini-arrow, .node, .glass-square, .mini-card, .list-item, .tag, .btn-download, .btn-resume, .btn-primary, .btn-nav, .resume-modal-close'
        );
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachHoverTargets);
    } else {
        attachHoverTargets();
    }

    // Click pulse
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    // Hide/show cursor when leaving/entering window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });

    // Spawn glowing trail dot
    function spawnTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top  = y + 'px';
        trail.style.background = Math.random() > 0.5
            ? 'rgba(157, 78, 221, 0.7)'
            : 'rgba(255, 121, 198, 0.6)';
        const size = (Math.random() * 5 + 4) + 'px';
        trail.style.width  = size;
        trail.style.height = size;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 700);
    }
})();
