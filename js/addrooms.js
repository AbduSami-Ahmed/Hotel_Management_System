    // Initialize the map
    let map;
    let marker;

    document.addEventListener("DOMContentLoaded", () => {
        const cityDropdown = document.getElementById("city");
        const hotelDropdown = document.getElementById("hotel");

        // Fetch cities and populate the dropdown
        fetch("json/city.json")
            .then(response => response.json())
            .then(data => {
                cityDropdown.innerHTML += data.map(city => 
                    `<option value="${city.name}">${city.name}</option>`
                ).join('');
            })
            .catch(error => console.error("Error loading cities:", error));

        // Fetch hotels and populate the dropdown
        fetch("json/hotel.json")
            .then(response => response.json())
            .then(data => {
                hotelDropdown.innerHTML += data.map(hotel => 
                    `<option value="${hotel.name}">${hotel.name}</option>`
                ).join('');
            })
            .catch(error => console.error("Error loading hotels:", error));
    });

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.7136, lng: 46.6753 }, // Default to Riyadh
        zoom: 12
      });

      marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: { lat: 24.7136, lng: 46.6753 }
      });

      google.maps.event.addListener(marker, 'dragend', function() {
        const location = marker.getPosition();
        document.getElementById('location').value = `${location.lat()}, ${location.lng()}`;
      });
    }

    // Capacity control
    document.getElementById('increaseCapacity').addEventListener('click', () => {
      const capacityInput = document.getElementById('capacity');
      capacityInput.value = parseInt(capacityInput.value) + 1;
    });

    document.getElementById('decreaseCapacity').addEventListener('click', () => {
      const capacityInput = document.getElementById('capacity');
      if (parseInt(capacityInput.value) > 1) {
        capacityInput.value = parseInt(capacityInput.value) - 1;
      }
    });

    // Form submission
    document.getElementById('addRoomForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const room = {
        rid: Math.floor(100000 + Math.random() * 900000), // Auto-generate 6-digit rid
        roomName: document.getElementById('roomName').value,
        address: document.getElementById('address').value,
        location: document.getElementById('location').value,
        capacity: document.getElementById('capacity').value,
        price: document.getElementById('price').value,
        image: document.getElementById('image').files[0].name,
        status: 'Available',
        checkout: '',
        nodaysleft: 0
      };

      fetch('APIs JAVA Backend', {
        method: 'POST',
        body: JSON.stringify({ action: 'addRoom', ...room }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Room added successfully!');
          window.location.href = 'rooms.html';
        }
      })
      .catch(error => console.error('Error:', error));
    });