function showSection(sectionId) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("d-none");
  });

  document.getElementById(sectionId).classList.remove("d-none");
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    showSection(targetId);
  });
});
