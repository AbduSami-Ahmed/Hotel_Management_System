function goBackToHotels() {
    window.location.href = "hotel.html"; // Redirect to the hotel page
}
 
document.addEventListener("DOMContentLoaded", function () {
    let rooms = [];

    function addRoom() {
        const tableBody = document.getElementById("roomsTableBody");
        if (!tableBody) {
            console.error("Error: roomsTableBody not found!");
            return;
        }

        const roomId = `room-${rooms.length}`;
        rooms.push("");

        const row = document.createElement("tr");
        row.setAttribute("id", roomId);
        row.innerHTML = `
            <td><input type="text" placeholder="Enter room" oninput="updateRoom(${rooms.length - 1}, this.value)"></td>
            <td><button class="delete-btn" onclick="removeRoom('${roomId}', ${rooms.length - 1})">❌</button></td>
        `;
        tableBody.appendChild(row);
    }

    function updateRoom(index, value) {
        rooms[index] = value;
    }

    function removeRoom(roomId, index) {
        document.getElementById(roomId).remove();
        rooms.splice(index, 1);
    }

    function getData() {
        const city = document.getElementById('city').value;
        const hotel = document.getElementById('hotel').value;
        const filteredRooms = rooms.filter(room => room.trim() !== "");
    
        // Get the table body element
        const tableBody = document.getElementById("outputTableBody");
    
        // Clear previous data
        tableBody.innerHTML = "";
    
        // Insert new row with submitted data
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${city}</td>
            <td>${hotel}</td>
            <td>${filteredRooms.join(", ")}</td>
        `;
        tableBody.appendChild(newRow);
    }    

    // Expose functions globally
    window.addRoom = addRoom;
    window.updateRoom = updateRoom;
    window.removeRoom = removeRoom;
    window.getData = getData;
});
