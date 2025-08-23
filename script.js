document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            const offset = targetSection.offsetTop - 70;

            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        });
    });

    const highlightActive = () => {
        let scrollPos = window.scrollY + 80;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    highlightActive();
    window.addEventListener('scroll', highlightActive);
});