document.addEventListener("DOMContentLoaded", () => {
    fetch("json/city.json")
        .then(response => response.json())
        .then(data => {
            const cityFilter = document.getElementById("cityFilter");
            cityFilter.innerHTML = data.map(city => `<option value="${city.name}">${city.name}</option>`).join('');
        });

    fetch("json/hotel.json")
        .then(response => response.json())
        .then(data => {
            const hotelFilter = document.getElementById("hotelFilter");
            hotelFilter.innerHTML = data.map(hotel => `<option value="${hotel.name}">${hotel.name}</option>`).join('');
        });

    refreshCalendar();
    loadBookings();
});

function refreshCalendar() {
    const month = parseInt(document.getElementById("monthFilter").value);
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    const calendarTable = document.getElementById("calendarTable");
    let headerRow = `<tr><th>Room</th>`;
    for (let i = 1; i <= daysInMonth; i++) {
        headerRow += `<th>${i}</th>`;
    }
    headerRow += `</tr>`;
    calendarTable.querySelector("thead").innerHTML = headerRow;

    fetch("json/roombooking.json")
        .then(response => response.json())
        .then(data => {
            const calendarBody = document.getElementById("calendarBody");
            calendarBody.innerHTML = "";

            data.forEach(room => {
                let row = `<tr><td>${room.room}</td>`;

                for (let i = 1; i <= daysInMonth; i++) {
                    let cellClass = "green";
                    if (room.bookings.includes(i)) {
                        cellClass = "red";
                    } else if (room.filled.includes(i)) {
                        cellClass = "red";
                    } else if (room.canceled.includes(i)) {
                        cellClass = "orange";
                    }

                    row += `<td class="${cellClass}"></td>`;
                }
                row += "</tr>";
                calendarBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error loading room data:", error));
}

function loadBookings() {
    fetch("json/roombooking.json")
        .then(response => response.json())
        .then(data => {
            const bookingTable = document.querySelector("#bookingTable tbody");
            bookingTable.innerHTML = "";

            data.forEach(room => {
                if (room.bookings.length > 0) {
                    let row = `<tr>
                        <td>${room.room}</td>
                        <td>${room.bookings.join(", ")}</td>
                        <td><button class='cancel-btn' onclick='cancelBooking(${room.room})'>Cancel</button></td>
                    </tr>`;
                    bookingTable.innerHTML += row;
                }
            });
        })
        .catch(error => console.error("Error loading bookings:", error));
}

function cancelBooking(roomNumber) {
if (!confirm("Are you sure you want to cancel this booking?")) {
return; // Exit if the user clicks "Cancel"
}

fetch("json/roombooking.json")
.then(response => response.json())
.then(data => {
let room = data.find(r => r.room == roomNumber);
if (room) {
    let today = new Date().getDate();
    room.canceled = room.canceled ? [...room.canceled, today] : [today];
    room.bookings = room.bookings.filter(date => date !== today);
}
return fetch("json/roombooking.json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data, null, 2)
});
})
.then(() => {
alert("Booking canceled successfully!");
loadBookings();
})
.catch(error => console.error("Error canceling booking:", error));
}

document.getElementById("monthFilter").addEventListener("change", refreshCalendar);