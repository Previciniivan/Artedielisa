const galleries = {};

function initGallery(name) {
  const track = document.getElementById(`track-${name}`);
  const dotsBox = document.getElementById(`dots-${name}`);
  const slides = track.children.length;

  galleries[name] = { index: 0, slides, track, dotsBox };

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement("span");
    dot.onclick = () => goGallery(name, i);
    if (i === 0) dot.classList.add("active");
    dotsBox.appendChild(dot);
  }
}

function updateGallery(name) {
  const g = galleries[name];
  g.track.style.transform = `translateX(-${g.index * 100}%)`;
  [...g.dotsBox.children].forEach((d, i) =>
    d.classList.toggle("active", i === g.index)
  );
}

function nextGallery(name) {
  const g = galleries[name];
  g.index = (g.index + 1) % g.slides;
  updateGallery(name);
}

function prevGallery(name) {
  const g = galleries[name];
  g.index = (g.index - 1 + g.slides) % g.slides;
  updateGallery(name);
}

function goGallery(name, i) {
  galleries[name].index = i;
  updateGallery(name);
}

// INIT
initGallery("mani");
initGallery("ciglia");
initGallery("tatuaggi");
