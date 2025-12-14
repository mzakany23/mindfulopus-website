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
}

window.addEventListener('scroll', (ev) => {
    ev.preventDefault();
    windowScroll();
})

// Smooth scroll
var scroll = new SmoothScroll('#navbar-navlist a', {
    speed: 300,
    offset: 60
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

// Testimonial Carousel Class
class TestimonialCarousel {
    constructor(element) {
        this.carousel = element;
        this.track = element.querySelector('.testimonial-track');
        this.slides = Array.from(element.querySelectorAll('.testimonial-card'));
        this.nextButton = element.querySelector('.next');
        this.prevButton = element.querySelector('.prev');
        this.dotsContainer = element.querySelector('.carousel-dots');

        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 25000;

        this.initializeCarousel();
    }

    initializeCarousel() {
        // Create dots
        this.createDots();

        // Set initial styles
        this.track.style.display = 'flex';

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
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
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

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new TestimonialCarousel(
        document.querySelector('.testimonial-carousel')
    );
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
