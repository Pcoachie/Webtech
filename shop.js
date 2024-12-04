document.addEventListener("DOMContentLoaded", function () {
    const categoryButtons = document.querySelectorAll(".category-filter");
    const items = document.querySelectorAll(".items");
    const searchInput = document.getElementById("search-input");

    let activeCategory = "all"; // Default to show all categories

    // Function to filter items based on the category and search query
    function filterItems() {
        const query = searchInput.value.toLowerCase();

        items.forEach(item => {
            const itemCategory = item.getAttribute("data-category");
            const name = item.querySelector(".name").textContent.toLowerCase();
            const info = item.querySelector(".info").textContent.toLowerCase();

            // Check if the item matches the active category and search query
            const matchesCategory = activeCategory === "all" || itemCategory === activeCategory;
            const matchesSearch = name.includes(query) || info.includes(query);

            // Show or hide the item based on the combined conditions
            if (matchesCategory && matchesSearch) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Event listener for category buttons
    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            activeCategory = this.getAttribute("data-category");

            // Highlight the active category
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // Filter items based on the new category
            filterItems();
        });
    });

    // Event listener for the search input
    searchInput.addEventListener("input", filterItems);
});
