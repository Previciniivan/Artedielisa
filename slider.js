const slide = document.querySelectorAll('.hero-slider .slide');
const dotsBox = document.getElementById('heroDots'); // contenitore dei pallini
let currentSlide = 0;

if (slide.length > 0 && dotsBox) {
    // CREA I PALLINI
    slide.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goSlide(i));
        dotsBox.appendChild(dot);
    });

    function updateDots() {
        [...dotsBox.children].forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goSlide(i) {
        if (i === currentSlide) return; // niente cambio se clicchi sullo stesso
        // chiudi quello corrente
        slide[currentSlide].classList.remove('active');
        slide[currentSlide].classList.add('exit');

        // apri quello nuovo
        currentSlide = i;
        slide[currentSlide].classList.add('active');

        setTimeout(() => {
            slide.forEach((s, idx) => {
                if (idx !== currentSlide) s.classList.remove('exit');
            });
        }, 1000);

        updateDots();
    }

    // SCORRIMENTO AUTOMATICO
    setInterval(() => {
        // chiudi quello corrente
        slide[currentSlide].classList.remove('active');
        slide[currentSlide].classList.add('exit');

        // passa al prossimo
        currentSlide = (currentSlide + 1) % slide.length;
        slide[currentSlide].classList.add('active');

        setTimeout(() => {
            slide.forEach((s, idx) => {
                if (idx !== currentSlide) s.classList.remove('exit');
            });
        }, 1000);

        updateDots();
    }, 4000);
}
