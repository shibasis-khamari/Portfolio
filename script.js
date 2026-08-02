(() => {
    'use strict';

    /* ==================== PARTICLE BACKGROUND ==================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.005;
                this.y -= dy * 0.005;
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(196, 93, 62, ${this.opacity * 0.15})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(196, 93, 62, ${0.03 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    /* ==================== TYPING EFFECT ==================== */
    const typedEl = document.getElementById('typed-text');
    const phrases = ['scalable web applications', 'modern user interfaces', 'seamless user experiences', 'full-stack solutions'];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const current = phrases[phraseIdx];
        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40;
        } else {
            typedEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIdx === current.length) {
            typeSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);

    /* ==================== COUNTER ANIMATION ==================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;
        statNumbers.forEach(el => {
            const target = parseInt(el.dataset.target);
            const duration = 2000;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
        });
        statsCounted = true;
    }

    /* ==================== SCROLL REVEAL ==================== */
    document.body.classList.add('js-reveal-active');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    function checkReveal() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 1.2 && rect.bottom > -100) {
                el.classList.add('revealed');
            }
        });
    }

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('revealed'), i * 30);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.01, rootMargin: '100px 0px 100px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Initial fallback check
    checkReveal();
    window.addEventListener('scroll', checkReveal);
    window.addEventListener('load', checkReveal);

    /* ==================== SKILL BARS ==================== */
    const skillBars = document.querySelectorAll('.skill-bar');
    let skillsAnimated = false;

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                skillBars.forEach((bar, i) => {
                    const percent = bar.dataset.percent;
                    const fill = bar.querySelector('.skill-fill');
                    const label = bar.querySelector('.skill-percent');
                    setTimeout(() => {
                        fill.style.width = percent + '%';
                        let count = 0;
                        const countUp = setInterval(() => {
                            count++;
                            label.textContent = count + '%';
                            if (count >= parseInt(percent)) clearInterval(countUp);
                        }, 15);
                    }, i * 200);
                });
            }
        });
    }, { threshold: 0.3 });

    if (skillBars.length) skillObserver.observe(skillBars[0].closest('.skill-category'));

    /* ==================== NAVBAR ==================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.sidebar .nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link-item');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Active section highlight
        let current = 'hero';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });
        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) link.classList.add('active');
        });
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    /* ==================== PROGRESS BAR ==================== */
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
    });

    /* ==================== BACK TO TOP ==================== */
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    });

    /* ==================== PROJECT FILTERS ==================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach((card, i) => {
                card.style.transition = 'opacity 0.4s, transform 0.4s';
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, i * 80);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => card.classList.add('hidden'), 400);
                }
            });
        });
    });

    /* ==================== TESTIMONIAL SLIDER ==================== */
    const track = document.getElementById('testimonial-track');
    const cards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonial-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;

    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
    });

    // Auto-slide
    let autoSlide = setInterval(() => {
        goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
    }, 5000);

    track.closest('.testimonials-wrapper').addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.closest('.testimonials-wrapper').addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
        }, 5000);
    });

    /* ==================== CONTACT FORM ==================== */
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit span');
        btn.textContent = 'Sent!';
        setTimeout(() => { btn.textContent = 'Send Message'; }, 3000);
        form.reset();
    });

    /* ==================== STAT COUNTER TRIGGER ==================== */
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }

    /* ==================== HERO PHOTO ==================== */
    const heroPhotoImg = document.getElementById('hero-photo-img');
    const photoPlaceholder = document.getElementById('photo-placeholder');

    if (heroPhotoImg) {
        heroPhotoImg.addEventListener('load', () => {
            heroPhotoImg.classList.add('loaded');
            if (photoPlaceholder) photoPlaceholder.classList.add('hidden');
        });
        heroPhotoImg.addEventListener('error', () => {
            heroPhotoImg.style.display = 'none';
        });
    }

    // 3D tilt on hero photo
    const heroPhoto = document.getElementById('hero-photo');
    if (heroPhoto) {
        heroPhoto.addEventListener('mousemove', e => {
            const rect = heroPhoto.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroPhoto.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
        });
        heroPhoto.addEventListener('mouseleave', () => {
            heroPhoto.style.transform = 'rotateY(0) rotateX(0)';
            heroPhoto.style.transition = 'transform 0.5s ease';
        });
        heroPhoto.addEventListener('mouseenter', () => {
            heroPhoto.style.transition = 'transform 0.1s ease';
        });
    }

    /* ==================== RESUME MODAL ==================== */
    const resumeModal = document.getElementById('resume-modal');
    const resumeTrigger = document.querySelector('.resume-trigger');
    const resumeClose = document.getElementById('resume-close');
    const resumeOverlay = document.getElementById('resume-overlay');
    const resumeViewer = document.getElementById('resume-viewer');

    function openResume() {
        resumeModal.classList.remove('closing');
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeResume() {
        resumeModal.classList.add('closing');
        document.body.style.overflow = '';
        setTimeout(() => {
            resumeModal.classList.remove('open', 'closing');
        }, 450);
    }

    if (resumeTrigger) {
        resumeTrigger.addEventListener('click', e => {
            e.preventDefault();
            openResume();
        });
    }

    if (resumeClose) resumeClose.addEventListener('click', closeResume);
    if (resumeOverlay) resumeOverlay.addEventListener('click', closeResume);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
            closeResume();
        }
    });

    if (resumeViewer) {
        resumeViewer.addEventListener('error', () => {
            resumeViewer.style.display = 'none';
            document.getElementById('resume-fallback').style.display = 'flex';
        });
    }
})();
