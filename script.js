const menu = document.querySelector('.menu');
const openBtn = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.menu-close');
const body = document.body;

openBtn.addEventListener('click', () => {
    menu.classList.add('open');
    body.classList.add('menu-open');
});

closeBtn.addEventListener('click', () => {
    menu.classList.remove('open');
    body.classList.remove('menu-open');
});

document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('open');
        body.classList.remove('menu-open');
    });
});
