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

// Testimonial Carousel Class with Touch Dragging
class TestimonialCarousel {
    constructor(element) {
        if (!element) return;

        this.carousel = element;
        this.track = element.querySelector('.testimonial-track');
        this.container = element.querySelector('.carousel-container');
        this.slides = Array.from(element.querySelectorAll('.testimonial-card'));
        this.nextButton = element.querySelector('.next');
        this.prevButton = element.querySelector('.prev');
        this.dotsContainer = element.querySelector('.carousel-dots');

        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 25000;

        // Drag state
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragOffset = 0;
        this.threshold = 50; // Minimum drag distance to trigger slide change

        this.initializeCarousel();
    }

    initializeCarousel() {
        // Create dots
        this.createDots();

        // Set initial styles
        this.track.style.display = 'flex';
        this.track.style.transition = 'transform 0.3s ease';

        // Add event listeners
        this.addEventListeners();

        // Start autoplay
        this.startAutoplay();

        // Update initial state
        this.updateCarouselState();
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = Array.from(this.dotsContainer.children);
    }

    addEventListeners() {
        this.nextButton.addEventListener('click', () => this.nextSlide());
        this.prevButton.addEventListener('click', () => this.prevSlide());

        this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.carousel.addEventListener('mouseleave', () => {
            if (!this.isDragging) this.startAutoplay();
        });

        // Touch events for mobile dragging
        this.container.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleDragEnd(e));
        this.container.addEventListener('touchcancel', (e) => this.handleDragEnd(e));

        // Mouse events for desktop dragging
        this.container.addEventListener('mousedown', (e) => this.handleDragStart(e));
        this.container.addEventListener('mousemove', (e) => this.handleDragMove(e));
        this.container.addEventListener('mouseup', (e) => this.handleDragEnd(e));
        this.container.addEventListener('mouseleave', (e) => {
            if (this.isDragging) this.handleDragEnd(e);
        });

        // Prevent image dragging
        this.carousel.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    handleDragStart(e) {
        this.isDragging = true;
        this.startX = this.getPositionX(e);
        this.dragOffset = 0;
        this.track.classList.add('is-dragging');
        this.pauseAutoplay();
    }

    handleDragMove(e) {
        if (!this.isDragging) return;

        this.currentX = this.getPositionX(e);
        this.dragOffset = this.currentX - this.startX;

        // Calculate the base position
        const baseOffset = -(this.currentIndex * 100);
        // Calculate drag as percentage of container width
        const containerWidth = this.container.offsetWidth;
        const dragPercent = (this.dragOffset / containerWidth) * 100;

        // Apply transform with drag offset
        this.track.style.transform = `translateX(${baseOffset + dragPercent}%)`;

        // Prevent vertical scroll when dragging horizontally
        if (Math.abs(this.dragOffset) > 10) {
            e.preventDefault();
        }
    }

    handleDragEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.track.classList.remove('is-dragging');

        // Determine if we should change slides
        if (Math.abs(this.dragOffset) > this.threshold) {
            if (this.dragOffset < 0) {
                // Dragged left - go to next slide
                this.nextSlide();
            } else {
                // Dragged right - go to previous slide
                this.prevSlide();
            }
        } else {
            // Snap back to current slide
            this.updateCarouselState();
        }

        this.dragOffset = 0;

        // Restart autoplay after a delay
        setTimeout(() => {
            if (!this.isDragging) this.startAutoplay();
        }, 1000);
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarouselState();
    }

    nextSlide() {
        if (this.currentIndex === this.slides.length - 1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        this.updateCarouselState();
    }

    prevSlide() {
        if (this.currentIndex === 0) {
            this.currentIndex = this.slides.length - 1;
        } else {
            this.currentIndex--;
        }
        this.updateCarouselState();
    }

    updateCarouselState() {
        // Re-enable transition for smooth animation
        this.track.style.transition = 'transform 0.3s ease';

        // Move track using percentage
        const offset = -(this.currentIndex * 100);
        this.track.style.transform = `translateX(${offset}%)`;

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoplay() {
        if (this.autoplayInterval) return;
        this.autoplayInterval = setInterval(() => {
            if (this.currentIndex === this.slides.length - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateCarouselState();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

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

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.querySelector('.testimonial-carousel');
    if (carouselElement) {
        new TestimonialCarousel(carouselElement);
    }

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
