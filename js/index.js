function formatDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function calculateRemainingTime(checkoutDate) {
    const now = new Date();
    const checkout = new Date(checkoutDate);

    if (isNaN(checkout.getTime())) {
        return { daysLeft: 'Invalid Date', hoursLeft: '' };  // Return error if the date is invalid
    }

    const timeDifference = checkout - now;
    if (timeDifference <= 0) {
        return { daysLeft: '0', hoursLeft: '0' }; // No time left, already passed
    }

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return { daysLeft, hoursLeft };
}

function fetchRooms() {
    fetch('json/rooms.json', {
        method: 'POST',
     
        body: JSON.stringify({ action: 'getRooms' }),
    })
    .then(response => response.json())
    .then(data => {
        let tableBody = document.getElementById("roomTableBody");
        tableBody.innerHTML = "";

        // Retrieve deleted rooms from localStorage
        let deletedRooms = JSON.parse(localStorage.getItem("deletedRooms")) || [];

        if (Array.isArray(data)) {
            data.forEach((room, index) => {

                 // Skip rooms that are deleted
                 if (deletedRooms.includes(room.rid)) return;

                const { daysLeft, hoursLeft } = calculateRemainingTime(room.checkout);
                const formattedCheckoutDate = formatDate(new Date(room.checkout)); // Format checkout date

                // Set button color using ternary operator
                const statusColor = room.status === "Filled" ? "green" :
                                    room.status === "Exit Time" ? "red" :
                                    room.status === "Available" ? "orange" : "gray";


                // Default cleaning status
                let cleaningStatus = "Dirty"; 
                let cleaningColor = "red"; // Default to red for "Dirty"


                let row = `<tr>
                    <td class="room-name">${room.roomName}</td>
                    <td>${room.price}</td>
                    <td>
                      <button 
                        class="status-btn" 
                        style="background-color: ${statusColor}; color: white; border: none; padding: 3px 10px; cursor: pointer;"
                        onclick="${room.status === 'Filled' || room.status === 'Exit Time' ? 'updateStatus(\'' + room.rid + '\', \'' + room.checkout + '\')' : 'return false;'}">
                        ${room.status}
                     </button>

                    </td>
                    <td>${formattedCheckoutDate || 'N/A'}</td>
                    <td>${daysLeft} days ${hoursLeft} hours</td>

                    <td>
                        <button 
                            class="clean-btn"
                            id="clean-btn-${index}" 
                            style="background-color: ${cleaningColor}; color: white; padding: 5px 10px; border: none; cursor: pointer;" 
                            onclick="updateCleaningStatus(${index})">
                            ${cleaningStatus}
                        </button>
                    </td>

                    <td>
                        <span class="feedback-icon" onclick="openFeedbackModal(${index})">📝</span>
                    </td>

                    <td>
                        <button 
                            class="delete-btn"
                            style="background-color: red; color: white; padding: 5px 10px; border: none; cursor: pointer;" 
                            onclick="deleteRoom('${room.rid}')">
                            🗑
                        </button>
                    </td>

                </tr>`;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="5">No rooms available.</td></tr>`;
        }
    })
    .catch(error => {
        console.error('Error fetching rooms:', error);
        let tableBody = document.getElementById("roomTableBody");
        tableBody.innerHTML = `<tr><td colspan="5">Failed to load rooms. Please try again later.</td></tr>`;
    });
}


let selectedRoomIndex = null;
let selectedRating = 0;

function openFeedbackModal(index) {
    selectedRoomIndex = index;
    
    // Get the room number dynamically
    const roomNumber = 101 + index;  // Adjust this logic as needed
    document.getElementById("roomNumber").value = roomNumber;
    
    document.getElementById("feedbackModal").style.display = "block";
}

function closeFeedbackModal() {
    document.getElementById("feedbackModal").style.display = "none";
    
    // Clear input fields
    document.getElementById("hotelName").value = "";
    document.getElementById("roomNumber").value = "";
    document.getElementById("customerID").value = "";
    document.getElementById("ratingValue").value = "";
    document.getElementById("feedbackText").value = "";
    
    // Reset star rating
    selectedRating = 0;
    document.querySelectorAll(".rating span").forEach(star => star.classList.remove("selected"));
}

function setRating(stars) {
    selectedRating = stars;
    document.getElementById("ratingValue").value = stars;

    // Highlight selected stars
    const starsElements = document.querySelectorAll(".rating span");
    starsElements.forEach((star, index) => {
        if (index < stars) {
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }
    });
}

function submitFeedback() {
    const hotelName = document.getElementById("hotelName").value.trim();
    const roomNumber = document.getElementById("roomNumber").value.trim();
    const customerID = document.getElementById("customerID").value.trim();
    const feedbackText = document.getElementById("feedbackText").value.trim();

    if (!hotelName || !roomNumber || !feedbackText || selectedRating === 0) {
        alert("Please fill out all fields and select a rating.");
        return;
    }

    const feedbackData = {
        hotel: hotelName,
        room: roomNumber,
        customerID: customerID,
        rating: selectedRating,
        feedback: feedbackText
    };

    console.log("Feedback Submitted:", feedbackData);

    // Close the modal after submission
    closeFeedbackModal();
}


// Function to update room cleaning status
function updateCleaningStatus(index) {
    const button = document.getElementById(`clean-btn-${index}`);
    
    if (button.textContent.trim() === "Dirty") {
        button.textContent = "Clean";
        button.style.backgroundColor = "green";
    } else {
        button.textContent = "Dirty";
        button.style.backgroundColor = "red";
    }
}

// Function to update room status
function updateStatus(rid, checkout) {
    fetch('APIs JAVA Backend', {
        method: 'POST',
       // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateCheckout',rid: rid, checkout:'',status:'Available'}),
    })
    .then(response => response.json())

.then(data => {
    if (data.status === "success") {  // ✅ FIX: Correct check
        alert("checkout verified");
        fetchRooms();  // ✅ Refresh room list after update
    } else {
        alert("Failed to update status. Server returned an error.");
    }
})
.catch(error => {
    console.error("Error updating status:", error);
    alert("Failed to update status. Please check the console.");
});
}

function deleteRoom(roomId) {
    if (confirm("Are you sure you want to delete this room?")) {
        // Store deleted room ID in localStorage
        let deletedRooms = JSON.parse(localStorage.getItem("deletedRooms")) || [];
        deletedRooms.push(roomId);
        localStorage.setItem("deletedRooms", JSON.stringify(deletedRooms));

        // Remove the row from the table
        const row = document.getElementById(`room-${roomId}`);
        if (row) {
            row.remove();
            alert("Room deleted successfully!");
        }
    }
}
window.onload = fetchRooms;
