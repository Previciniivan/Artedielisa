const cards = document.querySelectorAll('.service-card-mobile');
let index = 0;



if (cards.length > 0) {
    cards[index].classList.add('active');

    setInterval(() => {

        const current = cards[index];
        const nextIndex = (index + 1) % cards.length;
        const next = cards[nextIndex];

        // prepara next
        next.classList.remove('exit-left');
        next.classList.add('active');

        // manda via current
        current.classList.remove('active');
        current.classList.add('exit-left');

        // aggiorna index
        index = nextIndex;
        // cleanup dopo animazione
        setTimeout(() => {
            current.classList.remove('exit-left');
        }, 600);
    }, 4000);
}