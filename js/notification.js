document.addEventListener("DOMContentLoaded", loadNotifications);

function loadNotifications() {
    fetch("json/notifications.json")
        .then(response => response.json())
        .then(data => {
            const notificationPanel = document.getElementById("notificationPanel");
            notificationPanel.innerHTML = "";

            if (data.length === 0) {
                notificationPanel.innerHTML = "<p>No notifications available.</p>";
                return;
            }

            data.forEach((notification, index) => {
                let notificationItem = `<div class='notification'>
                    <p>${notification.message}</p>
                    <small>${notification.timestamp}</small>
                    <button class="dismiss-btn" onclick='removeNotification(${index})'>Dismiss</button>
                </div>`;
                notificationPanel.innerHTML += notificationItem;
            });
        })
        .catch(error => console.error("Error loading notifications:", error));
}

function removeNotification(index) {
    fetch("json/notifications.json")
        .then(response => response.json())
        .then(data => {
            data.splice(index, 1); // Remove selected notification

            return fetch("json/notifications.json", {
                method: "PUT", // Placeholder for API in the future
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data, null, 2)
            });
        })
        .then(() => loadNotifications())
        .catch(error => console.error("Error removing notification:", error));
}

function addNotification(message) {
    fetch("json/notifications.json")
        .then(response => response.json())
        .then(data => {
            data.push({
                message: message,
                timestamp: new Date().toLocaleString()
            });

            return fetch("json/notifications.json", {
                method: "PUT", // Placeholder for API in the future
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data, null, 2)
            });
        })
        .then(() => loadNotifications())
        .catch(error => console.error("Error adding notification:", error));
}

function clearNotifications() {
    if (confirm("Are you sure you want to clear all notifications?")) {
        fetch("json/notifications.json", {
            method: "PUT", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([])
        })
        .then(() => {
            alert("All notifications cleared!");
            loadNotifications();
        })
        .catch(error => console.error("Error clearing notifications:", error));
    }
}
