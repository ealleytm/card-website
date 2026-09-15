document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const content = document.getElementById("contentContainer");
  const hamburger = document.querySelector(".hamburger");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');

  function updateActiveNav(name) {
    nav.querySelectorAll("button.nav-item").forEach(item => {
      item.classList.toggle("clicked", item.dataset.name === name);
    });
  }

  function loadPage(name) {
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      content.classList.remove("hidden");
    }

    updateActiveNav(name);

    fetch('/content/' + name + '.html')
      .then(r => {
        if (!r.ok) throw new Error("Network error");
        return r.text();
      })
      .then(html => {
        content.innerHTML = html;
        content.scrollTo({ top: 0, left: 0, behavior: "instant" });
        initContentScripts();
      })
      .catch(err => console.error(err));

    console.log(`ROUTER → ${name}`);
  }

  const router = new Navigo('/', { hash: true });

  router
    .on(':page', ({ data }) => loadPage(data.page))
    .on('/', () => loadPage('home'))
    .resolve();

  nav.querySelectorAll("button.nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      router.navigate(btn.dataset.name);
    });
  });

  content.addEventListener("click", (e) => {
    const card = e.target.closest(".card.clickable[data-name]");
    if (!card) return;
    router.navigate(card.dataset.name);
  });

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
    content.classList.toggle("hidden");
  });

  function initContentScripts() {
    document.querySelectorAll('.frame-media img').forEach(img => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.classList.add('open');
      });
    });

    modal.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

});
