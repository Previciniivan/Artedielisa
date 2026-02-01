
let gIndex = 0;
const track = document.getElementById("galleryTrack");
const dotsBox = document.getElementById("galleryDots");
const slides = track.children.length;

for (let i = 0; i < slides; i++) {
    const dot = document.createElement("span");
    dot.onclick = () => goGallery(i);
    if (i === 0) dot.classList.add("active");
    dotsBox.appendChild(dot);
}

function updateGallery() {
    track.style.transform = `translateX(-${gIndex * 100}%)`;
    [...dotsBox.children].forEach((d, i) =>
        d.classList.toggle("active", i === gIndex)
    );
}

function nextGallery() {
    gIndex = (gIndex + 1) % slides;
    updateGallery();
}

function prevGallery() {
    gIndex = (gIndex - 1 + slides) % slides;
    updateGallery();
}

function goGallery(i) {
    gIndex = i;
    updateGallery();
}

