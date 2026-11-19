document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById('secondary-nav');
  const copyright = document.getElementById('copyright');
  const header = document.querySelector("header");
  const content = document.getElementById('contentContainer');
  const hamburger = document.querySelector('.selected');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const router = new Navigo('/', { hash: true });

  // Nav buttons (delegated)
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button.nav-item");
    if (btn) router.navigate(btn.dataset.name), toggleHidden();
  });

  // Cards + images inside loaded content (delegated)
  content.addEventListener("click", (e) => {
    const img = e.target.closest(".frame-media img");
    if (img) {
      modalImg.src = img.src;
      modal.classList.add("open");
      return;
    }
  });

  modal.addEventListener("click", () => modal.classList.remove("open"));

  hamburger.addEventListener("click", () => {
    toggleHidden();
  });

  router
  .on("/", () => loadPage("home"))
  .on(":page", ({ data }) => loadPage(data.page))
  .resolve();

  function toggleHidden() {
    nav.classList.toggle("hidden");
    header.classList.toggle("short");
    copyright.classList.toggle("hidden");
    content.classList.toggle("hidden");
  }

  function loadPage(name) {
    nav.classList.remove("open");
    updateActiveNav(name);

    fetch(`content/${name}.html`)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load ${name}: ${r.status}`);
        return r.text();
      })
      .then(html => {
        content.innerHTML = html;
        content.scrollTo({ top: 0, left: 0, behavior: "instant" });
      })
      .catch(console.error);
  }

  function updateActiveNav(name) {
    nav.querySelectorAll("button.nav-item").forEach(item => {
      item.classList.toggle("clicked", item.dataset.name === name);
    });
  }
});