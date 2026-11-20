(() => {
  "use strict";

  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const filtersBox = document.getElementById("galleryFilters");
  const filters = filtersBox ? Array.from(filtersBox.querySelectorAll(".filter")) : [];
  const shots = Array.from(grid.querySelectorAll(".shot"));
  const moreBtn = document.getElementById("galleryMore");
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox ? lightbox.querySelector(".lightbox__img") : null;
  const lbTitle = lightbox ? lightbox.querySelector(".lightbox__title") : null;
  const lbCount = lightbox ? lightbox.querySelector(".lightbox__count") : null;
  const lbPrev = lightbox ? lightbox.querySelector("[data-lb-prev]") : null;
  const lbNext = lightbox ? lightbox.querySelector("[data-lb-next]") : null;
  const lbClose = lightbox ? lightbox.querySelector("[data-lb-close]") : null;

  let visible = shots.slice();
  let shown = 18;
  let index = 0;
  let lastFocus = null;

  const applyLimit = () => {
    shots.forEach((shot) => {
      const inFilter = visible.includes(shot);
      const inLimit = inFilter && visible.indexOf(shot) < shown;
      shot.classList.toggle("is-hidden", !inLimit);
    });

    if (moreBtn) {
      moreBtn.parentElement.hidden = shown >= visible.length;
    }
  };

  const setFilter = (value) => {
    visible = value === "all" ? shots.slice() : shots.filter((shot) => (shot.dataset.tags || "").includes(value));
    shown = 18;
    index = 0;
    applyLimit();
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      setFilter(button.dataset.filter || "all");
    });
  });

  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      shown += 18;
      applyLimit();
    });
  }

  const open = (shot) => {
    if (!lightbox || !lbImg) return;
    const list = shots.filter((item) => !item.classList.contains("is-hidden"));
    index = Math.max(0, list.indexOf(shot));
    lastFocus = document.activeElement;

    const render = () => {
      const current = list[index];
      if (!current) return;
      const img = current.querySelector("img");
      lbImg.src = current.dataset.full || img?.src || "";
      lbImg.alt = img?.alt || "";
      if (lbTitle) lbTitle.textContent = current.dataset.caption || "";
      if (lbCount) lbCount.textContent = `${index + 1} / ${list.length}`;
    };

    lightbox._list = list;
    lightbox._render = render;
    render();

    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    document.body.classList.add("is-locked");
    if (lbClose) lbClose.focus();
  };

  const close = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    document.body.classList.remove("is-locked");
    if (lbImg) lbImg.src = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  const step = (delta) => {
    if (!lightbox || !lightbox._list) return;
    const list = lightbox._list;
    index = (index + delta + list.length) % list.length;
    lightbox._render();
  };

  grid.addEventListener("click", (event) => {
    const shot = event.target.closest(".shot");
    if (shot) open(shot);
  });

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
  }

  if (lbClose) lbClose.addEventListener("click", close);
  if (lbPrev) lbPrev.addEventListener("click", () => step(-1));
  if (lbNext) lbNext.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });

  applyLimit();
})();
