document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');
    const footer = document.querySelector('footer');
    let isScrolling = false;
    let currentIndex = 0;
    const scrollDelay = 300;

    function smoothScrollTo(targetY) {
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
                setTimeout(() => { isScrolling = false; }, scrollDelay);
                checkFooter();
            }
        }

        requestAnimationFrame(animation);
    }

    function scrollToSection(index, trigger = 'manual') {
        if (index < 0 || index >= sections.length || isScrolling) return;
        isScrolling = true;
        currentIndex = index;
        console.log(`scrollToSection called by: ${trigger}, section index: ${index}`);
        smoothScrollTo(sections[index].offsetTop);
    }

    function checkFooter() {
        const lastSection = sections[sections.length - 1];
        const scrollBottom = window.scrollY + window.innerHeight;
        if (scrollBottom >= lastSection.offsetTop + 50) {
            footer.classList.add('show'); // slide up
        } else {
            footer.classList.remove('show'); // hide
        }
    }

    window.addEventListener('wheel', e => {
        e.preventDefault();
        if (isScrolling) return;
        scrollToSection(e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1, 'wheel');
    }, { passive: false });

    let touchStartY = 0;
    window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; });
    window.addEventListener('touchend', e => {
        e.preventDefault();
        if (isScrolling) return;
        const delta = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(delta) > 50) {
            scrollToSection(delta > 0 ? currentIndex + 1 : currentIndex - 1, 'touch');
        }
    }, { passive: false });

    window.addEventListener('keydown', e => {
        if (isScrolling) return;
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                scrollToSection(currentIndex + 1, 'keyboard');
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                scrollToSection(currentIndex - 1, 'keyboard');
                break;
            case 'Home':
                e.preventDefault();
                scrollToSection(0, 'keyboard');
                break;
            case 'End':
                e.preventDefault();
                scrollToSection(sections.length - 1, 'keyboard');
                break;
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetIndex = Array.from(sections).findIndex(s => s.id === href.slice(1));
                scrollToSection(targetIndex, 'click');
            }
        });
    });

    function highlightActive() {
        const scrollPos = window.scrollY + 10;
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
    }

    highlightActive();
    window.addEventListener('scroll', highlightActive);
    window.addEventListener('resize', checkFooter);

    document.getElementById("burger").addEventListener("click", () => {
        document.getElementById("nav-links").classList.toggle("active");
    });

    ['scroll', 'touchmove', 'wheel'].forEach(ev => {
        window.addEventListener(ev, e => e.preventDefault(), { passive: false });
    });
    window.addEventListener('keydown', e => {
        const keysToPrevent = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        if (keysToPrevent.includes(e.key)) e.preventDefault();
    });

    checkFooter();
});
