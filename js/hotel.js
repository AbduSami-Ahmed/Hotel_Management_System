document.addEventListener("DOMContentLoaded", () => {
    const selectedCity = localStorage.getItem("selectedCity");
    document.getElementById("cityTitle").textContent = `Hotels in ${selectedCity}`;

    const categoryFilter = document.getElementById("hotelCategoryFilter");
    const hotelList = document.getElementById("hotelList");

    let allHotels = []; // Store all hotels globally to allow filtering

    // Fetch hotels data
    fetch("json/hotel.json")
        .then(response => response.json())
        .then(hotels => {
            allHotels = hotels.filter(hotel => hotel.city === selectedCity);
            
            if (allHotels.length === 0) {
                hotelList.innerHTML = "<p>No hotels found in this city.</p>";
                return;
            }

            populateCategoryFilter(allHotels);
            displayHotels(allHotels); // ✅ Display all hotels by default
        })
        .catch(error => console.error("Error loading hotels:", error));

    // Populate category dropdown (Always show all categories)
    function populateCategoryFilter(hotels) {
        const categories = ["All Categories", ...new Set(hotels.map(hotel => hotel.category))];

        categoryFilter.innerHTML = ""; // Clear existing options
        categories.forEach(category => {
            let option = document.createElement("option");
            option.value = category.toLowerCase();
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        categoryFilter.addEventListener("change", () => {
            const selectedCategory = categoryFilter.value.toLowerCase();
            displayHotels(selectedCategory === "all categories" ? allHotels : allHotels.filter(hotel => hotel.category.toLowerCase() === selectedCategory));
        });
    }

    // Display hotels based on selected category
    function displayHotels(hotels) {
        hotelList.innerHTML = ""; // Clear existing hotels

        if (hotels.length === 0) {
            hotelList.innerHTML = "<p>No hotels found in this category.</p>";
            return;
        }

        hotels.forEach(hotel => {
            let hotelButton = document.createElement("button");
            hotelButton.textContent = hotel.name;
            hotelButton.className = "room-card";
            hotelButton.style.display = "block";
            hotelButton.style.width = "100%";
            hotelButton.style.padding = "10px";
            hotelButton.style.marginBottom = "5px";
            hotelButton.onclick = () => {
                localStorage.setItem("selectedHotel", hotel.name);
                window.location.href = "index.html";
            };
            hotelList.appendChild(hotelButton);
        });
    }
});
