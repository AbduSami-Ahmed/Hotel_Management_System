// Set default Check-In and Check-Out times
const today = new Date();
const checkinDate = new Date(today);
checkinDate.setHours(14, 0, 0, 0); // Default Check-In time: 2 PM
const checkoutDate = new Date(today);
checkoutDate.setDate(checkoutDate.getDate() + 1); // Default Check-Out: Next day
checkoutDate.setHours(15, 0, 0, 0); // Default Check-Out time: 3 PM

// Format dates as dd-MMM-YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Set default Check-In and Check-Out values
document.getElementById('checkin').value = checkinDate.toISOString().split('T')[0];
document.getElementById('checkout').value = checkoutDate.toISOString().split('T')[0];

// Form submission with block booking validation
document.getElementById('checkinForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Validate Name (at least 5 characters)
  const name = document.getElementById('name').value;
  if (name.length < 5) {
    alert('Name must be at least 5 characters long.');
    return;
  }

  // Validate Phone (10 digits)
  const phone = document.getElementById('phone').value;
  if (phone && !/^\d{10}$/.test(phone)) {
    alert('Phone number must be 10 digits.');
    return;
  }

  // Fetch existing check-ins and check for conflicts
  const roomNumber = document.getElementById('room').value;
  const checkinDate = new Date(document.getElementById('checkin').value);
  const checkoutDate = new Date(document.getElementById('checkout').value);

  fetch('json/checkin.json')
    .then(response => response.json())
    .then(data => {
      const isAlreadyBooked = data.some(booking => {
        if (booking.room === roomNumber) {
          let existingCheckin = new Date(booking.checkin);
          let existingCheckout = new Date(booking.checkout);

          // Check if new booking overlaps with an existing one
          return checkinDate < existingCheckout && checkoutDate > existingCheckin;
        }
        return false;
      });

      if (isAlreadyBooked) {
        alert(`Room ${roomNumber} is already booked for the selected period.`);
        return;
      }

      // If no conflicts, proceed with check-in
      const newCheckin = {
        "room": roomNumber,
        "tenant": name,
        "contact": phone,
        "checkin": checkinDate.toISOString().split('T')[0],
        "checkout": checkoutDate.toISOString().split('T')[0],
        "price": document.getElementById('cost').value || 0
      };

      data.push(newCheckin);

      // Update checkin.json
      return fetch('json/checkin.json', {
        method: 'PUT', // Placeholder for API update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2)
      });
    })
    .then(() => {
      alert('Check-in successful!');
      window.location.href = 'rooms.html';
    })
    .catch(error => console.error('Error:', error));
});

// Function to populate the room dropdown
function populateRoomDropdown() {
  fetch('json/rooms.json')
    .then(response => response.json())
    .then(data => {
      const roomDropdown = document.getElementById('room');
      roomDropdown.innerHTML = '<option value="">Select a Room</option>'; 

      data.forEach(room => {
        const option = document.createElement('option');
        option.value = room.roomName; 
        option.textContent = room.roomName; 

        // Apply color based on room status
        option.style.color = room.status === "Filled" ? "green" :
                             room.status === "Exit Time" ? "red" :
                             room.status === "Available" ? "orange" : "gray";

        roomDropdown.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching rooms:', error));
}

// Call function to populate the dropdown when the page loads
document.addEventListener('DOMContentLoaded', populateRoomDropdown);
