const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");
const prevBtn = document.getElementById("viewerPrev");
const nextBtn = document.getElementById("viewerNext");
const closeBtn = document.getElementById("viewerClose");

let activeImages = [];
let activeIndex = 0;

function renderImage() {
  if (!activeImages.length) return;
  const current = activeImages[activeIndex];
  viewerImg.src = current.src;
  viewerImg.alt = current.alt || "Project screenshot preview";
}

function openViewer(images, index) {
  activeImages = images;
  activeIndex = index;
  renderImage();
  viewer.classList.add("show");
  viewer.setAttribute("aria-hidden", "false");
}

function closeViewer() {
  viewer.classList.remove("show");
  viewer.setAttribute("aria-hidden", "true");
  viewerImg.removeAttribute("src");
  activeImages = [];
}

function changeImage(step) {
  if (!activeImages.length) return;
  activeIndex = (activeIndex + step + activeImages.length) % activeImages.length;
  renderImage();
}

document.querySelectorAll(".screenshots").forEach((gallery) => {
  const images = Array.from(gallery.querySelectorAll("img"));
  images.forEach((img, index) => {
    img.addEventListener("click", () => openViewer(images, index));
  });
});

document.querySelectorAll(".project-card").forEach((card) => {
  const gallery = card.querySelector(".screenshots");
  const moreBtn = card.querySelector(".more-btn");
  if (!gallery || !moreBtn) return;

  moreBtn.addEventListener("click", () => {
    const expanded = gallery.classList.toggle("expanded");
    moreBtn.textContent = expanded ? "Show less" : "+ more screenshots";
  });
});

prevBtn.addEventListener("click", () => changeImage(-1));
nextBtn.addEventListener("click", () => changeImage(1));
closeBtn.addEventListener("click", closeViewer);

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) closeViewer();
});

document.addEventListener("keydown", (event) => {
  if (!viewer.classList.contains("show")) return;
  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowLeft") changeImage(-1);
  if (event.key === "ArrowRight") changeImage(1);
});

const navLinks = Array.from(document.querySelectorAll(".topbar nav a"));
const sectionIds = navLinks
  .map((link) => link.getAttribute("href"))
  .filter((href) => href && href.startsWith("#"))
  .map((href) => href.slice(1));
const observedSections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    const headerHeight = document.querySelector(".topbar")?.offsetHeight || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  });
});

function setActiveNav(activeId) {
  navLinks.forEach((link) => {
    const linkId = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", linkId === activeId);
  });
}

function updateActiveNavByScroll() {
  if (!observedSections.length) return;
  const headerHeight = document.querySelector(".topbar")?.offsetHeight || 0;
  const marker = window.scrollY + headerHeight + 24;
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 8;

  if (nearBottom) {
    setActiveNav(observedSections[observedSections.length - 1].id);
    return;
  }

  let current = observedSections[0].id;
  observedSections.forEach((section) => {
    if (marker >= section.offsetTop) current = section.id;
  });

  setActiveNav(current);
}

window.addEventListener("scroll", updateActiveNavByScroll, { passive: true });
window.addEventListener("resize", updateActiveNavByScroll);
window.addEventListener("load", updateActiveNavByScroll);
updateActiveNavByScroll();
