document.addEventListener("DOMContentLoaded", () => {
	const header = document.getElementById("header");
	const checkbox = document.getElementById("sidebarToggle");

	if (!header || !checkbox) return;

	function onScroll() {
		if(checkbox.checked) return; // Do nothing if sidebar is open
			if (window.scrollY > 100) {
			header.classList.remove("header-hero");
		} else {
			header.classList.add("header-hero");
		}
	}

	window.addEventListener("scroll", onScroll);
	onScroll(); // Set initial state
});