document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');
    const footer = document.querySelector('footer');
    let isScrolling = false;
    let currentIndex = 0;
    const scrollDelay = 300; // ms delay before next scroll

    function smoothScrollTo(targetY, callback) {
        let startY = window.scrollY;
        let distance = targetY - startY;
        let duration = 600;
        let startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
        }

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const eased = easeInOutCubic(progress);
            window.scrollTo(0, startY + distance * eased);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                setTimeout(() => { isScrolling = false; }, scrollDelay); // delay before next scroll
                if (callback) callback();
            }
        }

        requestAnimationFrame(animation);
    }

    function scrollToSection(index) {
        if (index < 0) index = 0;
        if (index >= sections.length) index = sections.length - 1;
        if (isScrolling || index === currentIndex) return;

        isScrolling = true;
        currentIndex = index;
        smoothScrollTo(sections[index].offsetTop, checkFooter);
    }

    function checkFooter() {
        const lastSection = sections[sections.length - 1];
        const scrollBottom = window.scrollY + window.innerHeight;

        if (scrollBottom >= lastSection.offsetTop + 50) {
            footer.classList.add('show');
        } else {
            footer.classList.remove('show');
        }
    }

    // Wheel scroll (desktop)
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;
        if (e.deltaY > 0) scrollToSection(currentIndex + 1);
        else scrollToSection(currentIndex - 1);
    }, { passive: false });

    // Touch scroll (mobile)
    let touchStartY = 0;
    window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; });
    window.addEventListener('touchend', e => {
        const touchEndY = e.changedTouches[0].clientY;
        const delta = touchStartY - touchEndY;
        if (Math.abs(delta) > 50) {
            if (delta > 0) scrollToSection(currentIndex + 1);
            else scrollToSection(currentIndex - 1);
        }
    });

    // Click smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.getElementById(href.slice(1));
                if (target) scrollToSection(Array.from(sections).indexOf(target));
            }
        });
    });

    // Highlight active link
    const highlightActive = () => {
        let scrollPos = window.scrollY + 10;
        sections.forEach((section, i) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${section.id}`) link.classList.add('active');
                });
                currentIndex = i;
            }
        });
        checkFooter();
    };

    highlightActive();
    window.addEventListener('scroll', highlightActive);
    window.addEventListener('resize', checkFooter);

    // Burger menu
    document.getElementById("burger").addEventListener("click", () => {
        document.getElementById("nav-links").classList.toggle("active");
    });

    // Initial footer check
    checkFooter();
});
