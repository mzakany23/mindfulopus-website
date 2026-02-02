/* Theme Name: Wizous
  Author: Themesdesign
  Version: 1.0.0
  File Description: Main JS file of the template
*/

//  Window scroll sticky class add
function windowScroll() {
    const navbar = document.getElementById("navbar");
    if (
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
    ) {
        navbar.classList.add("nav-sticky");
    } else {
        navbar.classList.remove("nav-sticky");
    }

    // Update scroll progress bar
    const scrollProgress = document.getElementById("scrollProgress");
    if (scrollProgress) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + "%";
    }

    // Hero wave parallax effect
    const waveContainer = document.querySelector('.hero-wave-container');
    if (waveContainer) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = document.querySelector('.hero-landing')?.offsetHeight || 800;

        // Only apply parallax when in the hero section area
        if (scrollTop < heroHeight * 1.5) {
            const waveBack = waveContainer.querySelector('.hero-wave--back');
            const waveMid = waveContainer.querySelector('.hero-wave--mid');
            const waveFront = waveContainer.querySelector('.hero-wave--front');

            // Different parallax speeds for depth effect
            if (waveBack) waveBack.style.transform = `translateY(${scrollTop * 0.15}px)`;
            if (waveMid) waveMid.style.transform = `translateY(${scrollTop * 0.08}px)`;
            if (waveFront) waveFront.style.transform = `translateY(${scrollTop * 0.03}px)`;
        }
    }

    // Services floating cards parallax effect - enhanced with rotation and depth
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection && window.innerWidth > 768) {
        const floatingCards = servicesSection.querySelectorAll('.services-floating__card');
        const sectionRect = servicesSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Only apply when section is in viewport
        if (sectionRect.top < viewportHeight && sectionRect.bottom > 0) {
            const progress = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height);

            floatingCards.forEach((card, index) => {
                const speed = parseFloat(card.dataset.parallaxSpeed) || 0.1;
                // Strong vertical movement for dramatic floating effect
                const offsetY = (progress - 0.5) * 400 * speed;
                // Horizontal sway based on card position (left vs right)
                const isLeftSide = index < 3;
                const offsetX = (progress - 0.5) * 60 * speed * (isLeftSide ? 1 : -1);
                // Rotation for floating feel
                const rotate = (progress - 0.5) * 8 * speed * (isLeftSide ? 1 : -1);

                card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${rotate}deg)`;
            });
        }
    }

    // Testimonial waterfall parallax effect
    const testimonialWaterfall = document.querySelector('.testimonial-waterfall');
    if (testimonialWaterfall && window.innerWidth > 768) {
        const columns = testimonialWaterfall.querySelectorAll('.waterfall-column');
        const sectionRect = testimonialWaterfall.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Only apply when section is in viewport
        if (sectionRect.top < viewportHeight && sectionRect.bottom > 0) {
            const progress = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height);

            columns.forEach(column => {
                const speed = parseFloat(column.dataset.parallaxSpeed) || 0.1;
                const offset = (progress - 0.5) * 150 * speed; // Stronger effect (150 vs 100)
                column.style.transform = `translateY(${offset}px)`;
            });
        }
    }
}

// ====================================
// PARALLAX SCROLL EFFECT
// ====================================
// Parallax effect handler for hero sections
class ParallaxHandler {
    constructor() {
        this.parallaxElements = document.querySelectorAll('[data-parallax="true"]');
        this.parallaxIntensity = 0.35; // Subtle parallax intensity (0.3-0.5)
        this.isMobile = window.innerWidth < 768;
        this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
        this.scrollTimeout = null;
        
        if (this.parallaxElements.length > 0) {
            this.init();
        }
    }

    init() {
        // Listen for window resize to update device detection
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        
        // Apply parallax on scroll - using requestAnimationFrame for smooth performance
        window.addEventListener('scroll', () => this.scheduleScroll(), { passive: true });
        
        // Initial parallax application
        this.updateParallax();
    }

    handleResize() {
        const wasDesktop = !this.isMobile && !this.isTablet;
        this.isMobile = window.innerWidth < 768;
        this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
        const isNowDesktop = !this.isMobile && !this.isTablet;

        // Reset parallax if changing between device types
        if (wasDesktop !== isNowDesktop) {
            this.updateParallax();
        }
    }

    scheduleScroll() {
        // Cancel previous scheduled update
        if (this.scrollTimeout) {
            cancelAnimationFrame(this.scrollTimeout);
        }
        
        // Schedule new update for next animation frame
        this.scrollTimeout = requestAnimationFrame(() => {
            this.updateParallax();
        });
    }

    updateParallax() {
        this.parallaxElements.forEach(element => {
            // Skip parallax on mobile devices (for performance)
            if (this.isMobile) {
                // Reset to no parallax on mobile
                element.style.setProperty('--bg-transform', 'translate3d(0, 0, 0)');
                return;
            }

            // Get element's position relative to viewport
            const elementRect = element.getBoundingClientRect();
            const elementTop = elementRect.top;
            const viewportHeight = window.innerHeight;
            const elementHeight = elementRect.height;

            // Calculate how much of the element is visible in viewport
            // When element is at top of viewport: -1
            // When element is centered in viewport: 0
            // When element is at bottom of viewport: 1
            const visibleProgress = (viewportHeight / 2 - elementTop) / (viewportHeight / 2 + elementHeight / 2);

            // Calculate parallax offset using subtle intensity
            let intensity = this.parallaxIntensity;

            // Reduce intensity on tablets for better mobile performance
            if (this.isTablet) {
                intensity = this.parallaxIntensity * 0.65;
            }

            // Apply parallax offset - background moves slower than scroll
            // Using negative value so background appears to move slower
            const offset = visibleProgress * 50 * intensity; // ±25px max on desktop

            // Apply CSS transform for GPU acceleration
            const transform = `translate3d(0, ${offset}px, 0)`;
            element.style.setProperty('--bg-transform', transform);
        });
    }
}

// Initialize parallax when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxHandler();
});

window.addEventListener('scroll', (ev) => {
    ev.preventDefault();
    windowScroll();
})

// Smooth scroll
var scroll = new SmoothScroll('#navbar-navlist a', {
    speed: 100,
    speedAsDuration: true,
    offset: 60
});

// Initialize AOS (Animate on Scroll) on window load to avoid layout shift issues
window.addEventListener('load', function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true, // Animation happens only once
            offset: 120, // Trigger when element is 120px into viewport
            delay: 0,
            disable: prefersReducedMotion // Respect accessibility preferences
        });
    }
});

// Well-Being Wheel button smooth scroll and menu collapse
document.addEventListener('DOMContentLoaded', function() {
    const wellbeingButton = document.getElementById('wellbeing-nav-button');
    const navbarCollapse = document.getElementById('navbarCollapse');
    const navbarToggler = document.querySelector('.navbar-toggler');

    // Sync hamburger menu animation with Bootstrap collapse state
    if (navbarCollapse && navbarToggler) {
        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            navbarToggler.setAttribute('aria-expanded', 'true');
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            navbarToggler.setAttribute('aria-expanded', 'false');
        });
    }

    if (wellbeingButton) {
        wellbeingButton.addEventListener('click', function(e) {
            e.preventDefault();

            // Get target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Collapse menu if it's open (mobile)
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    // Try Bootstrap collapse method first
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    } else {
                        // Fallback: manually collapse
                        navbarCollapse.classList.remove('show');
                        if (navbarToggler) {
                            navbarToggler.setAttribute('aria-expanded', 'false');
                        }
                    }
                }

                // Small delay to allow menu collapse animation
                setTimeout(function() {
                    // Smooth scroll to target
                    const offset = 60;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    }
});

// Navbar Active Class

var spy = new Gumshoe('#navbar-navlist a', {
    // Active classes
    navClass: 'active', // applied to the nav list item
    contentClass: 'active', // applied to the content
    offset: 70
});

// Contact Form
function validateForm() {
    var name = document.forms["myForm"]["name"].value;
    var email = document.forms["myForm"]["email"].value;
    var subject = document.forms["myForm"]["subject"].value;
    var comments = document.forms["myForm"]["comments"].value;
    document.getElementById("error-msg").style.opacity = 0;
    document.getElementById('error-msg').innerHTML = "";
    if (name == "" || name == null) {
        document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning'>*Please enter a Name*</div>";
        fadeIn();
        return false;
    }
    if (email == "" || email == null) {
        document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning'>*Please enter a Email*</div>";
        fadeIn();
        return false;
    }
    if (subject == "" || subject == null) {
        document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning'>*Please enter a Subject*</div>";
        fadeIn();
        return false;
    }
    if (comments == "" || comments == null) {
        document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning'>*Please enter a Comments*</div>";
        fadeIn();
        return false;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("simple-msg").innerHTML = this.responseText;
            document.forms["myForm"]["name"].value = "";
            document.forms["myForm"]["email"].value = "";
            document.forms["myForm"]["subject"].value = "";
            document.forms["myForm"]["comments"].value = "";
        }
    };
    xhttp.open("POST", "php/contact.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("name=" + name + "&email=" + email + "&subject=" + subject + "&comments=" + comments);
    return false;
}

function fadeIn() {
    var fade = document.getElementById("error-msg");
    var opacity = 0;
    var intervalID = setInterval(function () {
        if (opacity < 1) {
            opacity = opacity + 0.5
            fade.style.opacity = opacity;
        } else {
            clearInterval(intervalID);
        }
    }, 200);
}

// client-slider
const clientSliderElement = document.querySelector('.client-slider');
if (clientSliderElement) {
    var slider = tns({
        container: '.client-slider',
        loop: true,
        autoplay: true,
        nav: false,
        controlsPosition: 'bottom',
        controls: true,
        autoplayButtonOutput: false,
        controlsText: ["<i class='mdi mdi-arrow-left'></i>", "<i class='mdi mdi-arrow-right'></i>"],
        responsive: {
            1024: {
                gutter: 20,
                items: 2
            },
            768: {
                gutter: 20,
                items: 2
            }
        }
    });
}

// ====================================
// TESTIMONIAL WATERFALL SCROLL
// ====================================
class TestimonialWaterfallScroll {
    constructor() {
        this.waterfall = document.querySelector('.testimonial-waterfall');
        if (!this.waterfall) return;

        this.columns = this.waterfall.querySelectorAll('.waterfall-column');
        this.scrollPositions = Array.from(this.columns).map(() => 0);
        this.isHovering = false;

        this.init();
    }

    init() {
        // Track hover state
        this.waterfall.addEventListener('mouseenter', () => {
            this.isHovering = true;
            // Pause CSS animation and capture current visual position
            this.columns.forEach((col, i) => {
                const track = col.querySelector('.waterfall-track');
                // Get computed transform to maintain visual position
                const style = window.getComputedStyle(track);
                const matrix = new DOMMatrix(style.transform);
                this.scrollPositions[i] = matrix.m42; // translateY value
                track.style.animation = 'none';
                track.style.transform = `translateY(${this.scrollPositions[i]}px)`;
            });
        });

        this.waterfall.addEventListener('mouseleave', () => {
            this.isHovering = false;
            // Resume CSS animation
            this.columns.forEach((col, i) => {
                const track = col.querySelector('.waterfall-track');
                track.style.animation = '';
                track.style.transform = '';
            });
        });

        // Mouse wheel scrolling
        this.waterfall.addEventListener('wheel', (e) => {
            if (!this.isHovering) return;
            e.preventDefault();

            const delta = e.deltaY * 0.8; // Scroll sensitivity

            this.columns.forEach((col, i) => {
                const track = col.querySelector('.waterfall-track');
                const trackHeight = track.scrollHeight / 2; // Half because content is duplicated
                const direction = col.classList.contains('waterfall-column--down') ? -1 : 1;

                // Update scroll position
                this.scrollPositions[i] += delta * direction;

                // Loop the scroll position
                if (this.scrollPositions[i] > 0) {
                    this.scrollPositions[i] = -trackHeight;
                } else if (this.scrollPositions[i] < -trackHeight) {
                    this.scrollPositions[i] = 0;
                }

                track.style.transform = `translateY(${this.scrollPositions[i]}px)`;
            });
        }, { passive: false });

        // Touch scrolling for mobile
        let touchStartY = 0;
        let lastTouchY = 0;

        this.waterfall.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            lastTouchY = touchStartY;
            this.isHovering = true;

            this.columns.forEach((col, i) => {
                const track = col.querySelector('.waterfall-track');
                const style = window.getComputedStyle(track);
                const matrix = new DOMMatrix(style.transform);
                this.scrollPositions[i] = matrix.m42;
                track.style.animation = 'none';
                track.style.transform = `translateY(${this.scrollPositions[i]}px)`;
            });
        }, { passive: true });

        this.waterfall.addEventListener('touchmove', (e) => {
            if (!this.isHovering) return;

            const touchY = e.touches[0].clientY;
            const delta = (lastTouchY - touchY) * 1.5;
            lastTouchY = touchY;

            this.columns.forEach((col, i) => {
                const track = col.querySelector('.waterfall-track');
                const trackHeight = track.scrollHeight / 2;
                const direction = col.classList.contains('waterfall-column--down') ? -1 : 1;

                this.scrollPositions[i] += delta * direction;

                if (this.scrollPositions[i] > 0) {
                    this.scrollPositions[i] = -trackHeight;
                } else if (this.scrollPositions[i] < -trackHeight) {
                    this.scrollPositions[i] = 0;
                }

                track.style.transform = `translateY(${this.scrollPositions[i]}px)`;
            });
        }, { passive: true });

        this.waterfall.addEventListener('touchend', () => {
            // Resume animation after a short delay
            setTimeout(() => {
                if (!this.isHovering) return;
                this.isHovering = false;
                this.columns.forEach(col => {
                    const track = col.querySelector('.waterfall-track');
                    track.style.animation = '';
                    track.style.transform = '';
                });
            }, 2000);
        });
    }
}

// Initialize waterfall scroll
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialWaterfallScroll();
});

// ====================================
// TESTIMONIAL WATERFALL MODAL
// ====================================
class TestimonialModal {
    constructor() {
        this.modal = document.getElementById('testimonialModal');
        if (!this.modal) return;

        this.backdrop = this.modal.querySelector('.testimonial-modal__backdrop');
        this.closeBtn = this.modal.querySelector('.testimonial-modal__close');
        this.quoteEl = document.getElementById('modalQuote');
        this.authorEl = document.getElementById('modalAuthor');
        this.roleEl = document.getElementById('modalRole');
        this.cards = document.querySelectorAll('.waterfall-card');

        this.init();
    }

    init() {
        // Card click handlers
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => this.openModal(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openModal(card);
                }
            });
        });

        // Close handlers
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.backdrop.addEventListener('click', () => this.closeModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.getAttribute('aria-hidden') === 'false') {
                this.closeModal();
            }
        });
    }

    openModal(card) {
        const quote = card.dataset.quote;
        const author = card.dataset.author;
        const role = card.dataset.role;

        // Populate content
        this.quoteEl.textContent = `"${quote}"`;

        if (author === 'Anonymous') {
            this.authorEl.textContent = role;
            this.roleEl.textContent = '';
            this.roleEl.style.display = 'none';
        } else {
            this.authorEl.textContent = author;
            this.roleEl.textContent = role;
            this.roleEl.style.display = 'block';
        }

        // Show modal
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus close button for accessibility
        setTimeout(() => this.closeBtn.focus(), 100);
    }

    closeModal() {
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Initialize testimonial modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialModal();

    // Services Group Image Carousel
    const groupCarousel = document.querySelector('.services-group__carousel');
    if (groupCarousel) {
        const slides = groupCarousel.querySelectorAll('.services-group__slide');
        const dots = groupCarousel.querySelectorAll('.services-group__dot');
        let currentSlide = 0;
        let autoplayInterval;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('is-active'));
            dots.forEach(dot => dot.classList.remove('is-active'));
            slides[index].classList.add('is-active');
            dots[index].classList.add('is-active');
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoplay();
                startAutoplay();
            });
        });

        // Pause on hover
        groupCarousel.addEventListener('mouseenter', stopAutoplay);
        groupCarousel.addEventListener('mouseleave', startAutoplay);

        // Start autoplay
        startAutoplay();
    }
});

// ====================================
// HERO CARD CAROUSEL
// ====================================
// Auto-rotating content carousel for hero cards (Medium articles, Podcast episodes)
class HeroCardCarousel {
    constructor(card, carouselData) {
        this.card = card;
        this.type = card.dataset.carousel; // 'medium' or 'podcast'
        this.items = carouselData[this.type] || [];
        this.contentWrapper = card.querySelector('.hero-card__content');
        this.titleEl = card.querySelector('.hero-card__title');
        this.excerptEl = card.querySelector('.hero-card__excerpt');
        this.dotsContainer = card.querySelector('.hero-card__dots');

        if (this.items.length <= 1) return;

        this.currentIndex = 0;
        this.interval = 6000; // 6 seconds per item
        this.progressInterval = 50; // Update progress every 50ms
        this.progress = 0;
        this.isPaused = false;
        this.autoplayTimer = null;
        this.progressTimer = null;

        this.init();
    }

    init() {
        // Create dot indicators (max 5 shown)
        this.createDots();

        // Event listeners for pause on hover
        this.card.addEventListener('mouseenter', () => this.pause());
        this.card.addEventListener('mouseleave', () => this.resume());
        this.card.addEventListener('focusin', () => this.pause());
        this.card.addEventListener('focusout', () => this.resume());

        // Start autoplay
        this.start();
    }

    createDots() {
        const maxDots = Math.min(this.items.length, 5);
        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('span');
            dot.className = 'hero-card__dot' + (i === 0 ? ' is-active' : '');
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goTo(i);
            });
            this.dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(this.dotsContainer.children);
    }

    start() {
        this.card.classList.add('is-animating');
        this.startProgress();
        this.scheduleNext();
    }

    pause() {
        this.isPaused = true;
        this.card.classList.remove('is-animating');
        this.clearTimers();
    }

    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.card.classList.add('is-animating');
        this.startProgress();
        this.scheduleNext();
    }

    clearTimers() {
        if (this.autoplayTimer) {
            clearTimeout(this.autoplayTimer);
            this.autoplayTimer = null;
        }
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
    }

    startProgress() {
        this.progress = 0;
        this.updateProgressBar();

        this.progressTimer = setInterval(() => {
            this.progress += (this.progressInterval / this.interval) * 100;
            this.updateProgressBar();
        }, this.progressInterval);
    }

    updateProgressBar() {
        this.card.style.setProperty('--progress', `${Math.min(this.progress, 100)}%`);
    }

    scheduleNext() {
        const remainingTime = this.interval * (1 - this.progress / 100);
        this.autoplayTimer = setTimeout(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, remainingTime);
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goTo(nextIndex);
    }

    goTo(index) {
        if (index === this.currentIndex) return;

        this.clearTimers();
        this.currentIndex = index;

        // Fade out content
        this.contentWrapper.classList.add('is-fading');

        // After fade out, update content and fade in
        setTimeout(() => {
            this.updateContent();
            this.contentWrapper.classList.remove('is-fading');

            // Reset progress and continue
            if (!this.isPaused) {
                this.startProgress();
                this.scheduleNext();
            }
        }, 400); // Match CSS transition duration

        // Update dots
        this.updateDots();
    }

    updateContent() {
        const item = this.items[this.currentIndex];

        if (this.type === 'medium') {
            this.titleEl.textContent = item.title;
            this.excerptEl.textContent = this.truncate(item.excerpt, 80);
            this.card.href = item.link;
        } else if (this.type === 'podcast') {
            this.titleEl.textContent = item.title;
            this.excerptEl.textContent = this.truncate(item.description, 80);
        }
    }

    updateDots() {
        const dotIndex = this.currentIndex % this.dots.length;
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === dotIndex);
        });
    }

    truncate(str, length) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length).trim() + '...';
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Typed.js for hero headline
    const typedElement = document.getElementById('typed-headline');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed-headline', {
            strings: ['one opus at a time.'],
            typeSpeed: 50,
            startDelay: 800,
            showCursor: false
        });
    }

    // Initialize Hero Card Carousels
    const carouselDataScript = document.getElementById('hero-carousel-data');
    if (carouselDataScript) {
        try {
            const carouselData = JSON.parse(carouselDataScript.textContent);
            const heroCarouselCards = document.querySelectorAll('.hero-card[data-carousel]');
            heroCarouselCards.forEach(card => {
                new HeroCardCarousel(card, carouselData);
            });
        } catch (e) {
            console.warn('Could not parse carousel data:', e);
        }
    }
});

// HOME TITLE ANIMATION

const SELECTOR = {
    DEMO: document.querySelector('.heading-title'),
}

const CLASSES = {
    ANIMATED: `is-animated`
}

window.onload = function () {
      SELECTOR.DEMO.classList.add(CLASSES.ANIMATED);
      const timer = setInterval(() => {
        SELECTOR.DEMO.classList.remove(CLASSES.ANIMATED);
        clearInterval(timer)
      }, 700)

};

//Counter

const counter = document.querySelectorAll('.counter_value');
const speed = 250; // The lower the slower
counter.forEach(counter_value => {
    const updateCount = () => {
        const target = +counter_value.getAttribute('data-target');
        const count = +counter_value.innerText;
        const inc = target / speed;
        // Check if target is reached
        if (count < target) {
            // Add inc to count and output in counter_value
            counter_value.innerText = (count + inc).toFixed(0);
            // Call function every ms
            setTimeout(updateCount, 1);
        } else {
            counter_value.innerText = target;
        }
    };
    updateCount();
});

// typed

var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
    var that = this;
    var delta = 200 - Math.random() * 100;
    if (this.isDeleting) { delta /= 2; }
    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }
    setTimeout(function () {
        that.tick();
    }, delta);
};

function typewrite() {
    if (toRotate === 'undefined') {
        changeText()
    }
    else
        var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #ffffff}";
    document.body.appendChild(css);
};
window.onload(typewrite());
