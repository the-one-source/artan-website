/**
 * Utils
 */

// Throttle
const throttle = (callback, limit) => {
  let timeoutHandler = null;
  return () => {
    if (timeoutHandler == null) {
      timeoutHandler = setTimeout(() => {
        callback();
        timeoutHandler = null;
      }, limit);
    }
  };
};

// addEventListener Helper
const listen = (selector, event, callback) => {
  const ele = document.querySelector(selector);
  if (ele) ele.addEventListener(event, callback);
};

/**
 * Functions
 */

// Auto Hide Header
const header = document.querySelector('.site-header');
let lastScrollPosition = window.pageYOffset;

const autoHideHeader = () => {
  if (!header) return;
  const currentScrollPosition = window.pageYOffset;
  if (currentScrollPosition > lastScrollPosition) {
    header.classList.remove('slideInUp');
    header.classList.add('slideOutDown');
  } else {
    header.classList.remove('slideOutDown');
    header.classList.add('slideInUp');
  }
  lastScrollPosition = currentScrollPosition;
};

// Mobile Menu Toggle
let mobileMenuVisible = false;
const toggleMobileMenu = () => {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  if (!mobileMenuVisible) {
    mobileMenu.style.animationName = 'bounceInRight';
    mobileMenu.style.webkitAnimationName = 'bounceInRight';
    mobileMenu.style.display = 'block';
    mobileMenuVisible = true;
  } else {
    mobileMenu.style.animationName = 'bounceOutRight';
    mobileMenu.style.webkitAnimationName = 'bounceOutRight';
    mobileMenuVisible = false;
  }
};

// Featured Image Toggle
const showImg = () => {
  const bgImg = document.querySelector('.bg-img');
  if (bgImg) bgImg.classList.add('show-bg-img');
};
const hideImg = () => {
  const bgImg = document.querySelector('.bg-img');
  if (bgImg) bgImg.classList.remove('show-bg-img');
};

// ToC Toggle
const toggleToc = () => {
  const toc = document.getElementById('toc');
  if (toc) toc.classList.toggle('show-toc');
};

// Post-Year Navigation
const postYears = document.querySelectorAll('.post-year');
postYears.forEach(ele => {
  ele.addEventListener('click', () => {
    window.location.hash = '#' + ele.id;
  });
});

// Initialize Event Listeners
if (header) {
  listen('#menu-btn', 'click', toggleMobileMenu);
  listen('#toc-btn', 'click', toggleToc);
  listen('#img-btn', 'click', showImg);
  listen('.bg-img', 'click', hideImg);

  window.addEventListener('scroll', throttle(() => {
    autoHideHeader();
    if (mobileMenuVisible) toggleMobileMenu();
  }, 250));
}

document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.getElementById("typewriter");
    if (!textElement) return;

    const text = "The website is under construction";
    const typingSpeed = 200;      // ms per character typing
    const deletingSpeed = 50;     // ms per character deleting
    const pauseAfterTyping = 5000; // 5s pause at full text

    // Prepare container
    const span = document.createElement("span");
    textElement.innerHTML = "";
    textElement.appendChild(span);

    textElement.style.display = "inline-block";
    textElement.style.minWidth = "300px"; // maintain container width
    textElement.style.whiteSpace = "nowrap";
    textElement.style.textAlign = "center"; // text centered

    let index = 0;
    let isDeleting = false;

    function type() {
        span.textContent = text.substring(0, index);

        if (!isDeleting) {
            index++;
            if (index > text.length) {
                // Wait at full text, then start deleting
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, pauseAfterTyping);
                return;
            }
            setTimeout(type, typingSpeed);
        } else {
            index--;
            if (index < 0) {
                // Restart typing after deletion
                isDeleting = false;
                setTimeout(type, typingSpeed);
                return;
            }
            setTimeout(type, deletingSpeed);
        }
    }

    type();
});