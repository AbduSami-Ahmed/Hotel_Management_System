document.addEventListener("DOMContentLoaded", () => {
    fetch("json/city.json")
        .then(response => response.json())
        .then(cities => {
            const cityList = document.getElementById("cityList");
            cityList.innerHTML = "";

            cities.forEach(city => {
                let cityButton = document.createElement("button");
                cityButton.textContent = city.name;
                cityButton.className = "room-card";
                cityButton.style.display = "block";
                cityButton.style.width = "100%";
                cityButton.style.padding = "10px";
                cityButton.style.marginBottom = "5px";
                cityButton.onclick = () => {
                    localStorage.setItem("selectedCity", city.name);
                    window.location.href = "hotel.html";
                };
                cityList.appendChild(cityButton);
            });
        })
        .catch(error => console.error("Error loading cities:", error));
});
