/* ==========================================================================
   AURA MARKETING AGENCY - CUSTOM JAVASCRIPT & INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Burger Navigation
    const burgerMenu = document.getElementById('burger-menu-btn');
    const navMenu = document.getElementById('nav-menu-bar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // 2. Navbar Scrolling Effects & Active Indicator
    const navbar = document.getElementById('main-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active navigation section on scroll
        let currentSectionId = 'home';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 120; // offset navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // 3. Canvas Particle Connection Network
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Handle canvas sizing
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Update mouse position
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor(x, y, dx, dy, radius) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.radius = radius;
                this.baseRadius = radius;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
                ctx.fill();
            }

            update() {
                // Bounce off canvas boundary
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

                this.x += this.dx;
                this.y += this.dy;

                // Mouse interaction (repel slightly or connect)
                if (mouse.x !== null && mouse.y !== null) {
                    let distX = this.x - mouse.x;
                    let distY = this.y - mouse.y;
                    let distance = Math.sqrt(distX * distX + distY * distY);
                    
                    if (distance < mouse.radius) {
                        // Grow on hover
                        this.radius = this.baseRadius * 1.5;
                        
                        // Push slightly away
                        const forceDirectionX = distX / distance;
                        const forceDirectionY = distY / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * 1.2;
                        const directionY = forceDirectionY * force * 1.2;
                        
                        this.x += directionX;
                        this.y += directionY;
                    } else {
                        if (this.radius > this.baseRadius) {
                            this.radius -= 0.1;
                        }
                    }
                } else {
                    if (this.radius > this.baseRadius) {
                        this.radius -= 0.1;
                    }
                }

                this.draw();
            }
        }

        // Initialize particles
        const initParticles = () => {
            particles = [];
            let density = Math.floor((canvas.width * canvas.height) / 18000);
            density = Math.min(density, 80); // clamp for performance
            
            for (let i = 0; i < density; i++) {
                let radius = Math.random() * 2 + 1.5;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dx = (Math.random() - 0.5) * 0.8;
                let dy = (Math.random() - 0.5) * 0.8;
                particles.push(new Particle(x, y, dx, dy, radius));
            }
        };
        initParticles();
        window.addEventListener('resize', initParticles);

        // Drawing connection lines
        const drawConnections = () => {
            let maxDist = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let distSqr = (particles[a].x - particles[b].x) ** 2 + (particles[a].y - particles[b].y) ** 2;
                    if (distSqr < maxDist * maxDist) {
                        let dist = Math.sqrt(distSqr);
                        let opacity = 1 - (dist / maxDist);
                        ctx.strokeStyle = `rgba(0, 82, 255, ${opacity * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            drawConnections();
            requestAnimationFrame(animate);
        };
        animate();
    }


    // 4. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger animation only once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }


    // 5. Statistics Counters Animation on Scroll
    const statsSection = document.querySelector('.about-stats-container');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersRun = false;

    const startCounters = () => {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds count duration
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing out quadratic function
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                counter.innerText = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(updateCount);
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersRun) {
                    startCounters();
                    countersRun = true;
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }


    // 6. Filterable Portfolio Tag Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 350);
                }
            });
        });
    });


    // 7. Testimonials Slider/Carousel
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonial-prev-arrow');
    const nextBtn = document.getElementById('testimonial-next-arrow');
    const dotContainer = document.getElementById('testimonial-dots-indicator');
    let currentIndex = 0;
    let autoSlideInterval;

    const showTestimonial = (index) => {
        // Handle cycling bounds
        if (index >= testimonials.length) index = 0;
        if (index < 0) index = testimonials.length - 1;
        
        currentIndex = index;

        // Slide active card state
        testimonials.forEach((card, i) => {
            card.classList.remove('active');
            if (i === currentIndex) {
                card.classList.add('active');
            }
        });

        // Update dot indicator state
        const dots = dotContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentIndex) {
                dot.classList.add('active');
            }
        });
    };

    const nextTestimonial = () => showTestimonial(currentIndex + 1);
    const prevTestimonial = () => showTestimonial(currentIndex - 1);

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextTestimonial, 6000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    if (testimonials.length > 0 && prevBtn && nextBtn && dotContainer) {
        // Arrow Buttons clicks
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            resetAutoSlide();
        });

        // Dot indicators clicks
        dotContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('slider-dot')) {
                const targetIdx = parseInt(e.target.getAttribute('data-index'), 10);
                showTestimonial(targetIdx);
                resetAutoSlide();
            }
        });

        // Start cycling
        startAutoSlide();
    }


    // 8. Contact Form Validation & Web3Forms API Submission
    const contactForm = document.getElementById('agency-contact-form');
    const successBox = document.getElementById('form-success-alert');

    // CONFIGURATION: Retrieve your free access key from https://web3forms.com/ and paste it below.
    // If empty or set to placeholder, it will default to a mock success handler.
    const WEB3FORMS_ACCESS_KEY = "d8bd1764-29e0-40cd-92db-db8614bf81fa"; 

    if (contactForm && successBox) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clean active errors
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('invalid');
                const errorSpan = document.getElementById(`${input.name}-error`);
                if (errorSpan) errorSpan.style.display = 'none';
            });

            // 1. Spam protection - Honeypot field
            const botcheck = contactForm.querySelector('input[name="botcheck"]');
            if (botcheck && botcheck.checked) {
                console.warn('Bot submission blocked.');
                return;
            }

            let isValid = true;

            // Name verification
            const nameInput = document.getElementById('contact-name');
            if (nameInput.value.trim() === '') {
                nameInput.classList.add('invalid');
                document.getElementById('name-error').style.display = 'block';
                isValid = false;
            }

            // Email verification
            const emailInput = document.getElementById('contact-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('invalid');
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            }

            // Phone verification
            const phoneInput = document.getElementById('contact-phone');
            const phoneRegex = /^[+]?[0-9\s\-()]{7,18}$/; // validates international format
            if (!phoneInput || !phoneRegex.test(phoneInput.value.trim())) {
                if (phoneInput) phoneInput.classList.add('invalid');
                const phoneError = document.getElementById('phone-error');
                if (phoneError) phoneError.style.display = 'block';
                isValid = false;
            }

            // Service selector verification
            const serviceSelect = document.getElementById('contact-service');
            if (serviceSelect.value === '') {
                serviceSelect.classList.add('invalid');
                document.getElementById('service-error').style.display = 'block';
                isValid = false;
            }

            // Message content verification
            const messageInput = document.getElementById('contact-message');
            if (messageInput.value.trim() === '') {
                messageInput.classList.add('invalid');
                document.getElementById('message-error').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                const submitBtn = document.getElementById('contact-submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const loader = submitBtn.querySelector('.btn-loader');

                // Trigger sending state visual styles
                submitBtn.disabled = true;
                btnText.style.opacity = '0.5';
                loader.style.display = 'inline-block';

                const companyInput = document.getElementById('contact-company');
                const companyValue = companyInput ? companyInput.value.trim() : '';

                // If no API access key is configured yet, fall back to mock handler
                if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || WEB3FORMS_ACCESS_KEY.trim() === "") {
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        btnText.style.opacity = '1';
                        loader.style.display = 'none';

                        // Show success alert in UI
                        successBox.classList.add('show');
                        contactForm.reset();

                        // Print notification warning in console
                        console.info("Form submission simulated. Configured email: ahmadarifshaheen@gmail.com. Please replace 'YOUR_ACCESS_KEY_HERE' in script.js with a valid access key from web3forms.com to test live deliveries.");
                        
                        setTimeout(() => {
                            successBox.classList.remove('show');
                        }, 7000);
                    }, 1000);
                    return;
                }

                // Submit payload via Web3Forms API
                const payload = {
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `New Inquiry from Aura Website - ${nameInput.value.trim()}`,
                    from_name: "Aura Website Inquiries",
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    company: companyValue || "Not Provided",
                    service: serviceSelect.options[serviceSelect.selectedIndex].text,
                    message: messageInput.value.trim()
                };

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                })
                .then(async (response) => {
                    let json = await response.json();
                    submitBtn.disabled = false;
                    btnText.style.opacity = '1';
                    loader.style.display = 'none';

                    if (response.status === 200) {
                        // Success block
                        successBox.classList.add('show');
                        contactForm.reset();
                        setTimeout(() => {
                            successBox.classList.remove('show');
                        }, 7000);
                    } else {
                        // API Error block
                        console.error("Web3Forms API Error:", json);
                        alert("Submission failed: " + (json.message || "An error occurred. Please try again or email us directly at ahmadarifshaheen@gmail.com"));
                    }
                })
                .catch(error => {
                    // Network Error block
                    submitBtn.disabled = false;
                    btnText.style.opacity = '1';
                    loader.style.display = 'none';
                    console.error("Network Error:", error);
                    alert("Network error: Unable to connect to the email server. Please check your internet connection or email us directly at ahmadarifshaheen@gmail.com");
                });
            }
        });
    }
});
