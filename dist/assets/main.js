document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const checkbox = document.getElementById("sidebarToggle");

  if (!header || !checkbox) return;

  function onScroll() {
    if(checkbox.checked) return; // Do nothing if sidebar is open

    if (window.scrollY > 100) {
      header.classList.add("header-scrolled");
      header.classList.remove("header");
    } else {
      header.classList.remove("header-scrolled");
      header.classList.add("header");
    }
  }
  
  window.addEventListener("scroll", onScroll);
  onScroll(); // Set initial state
});