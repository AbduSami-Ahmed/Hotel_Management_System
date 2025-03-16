function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = date.toLocaleString('default', { month: 'short' }); // Get short month name (e.g., Jan, Feb)
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
    return `${day}-${month}-${year}`;
  }

function fetchData() {
    fetch('json/checkin.json', {
        method: 'POST',
        body: JSON.stringify({ action: 'getLogs' }),
    })
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => b.uid - a.uid);
        const tbody = document.querySelector('#logsTable tbody');
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.room}</td>
                <td>${item.tenant}</td>
                <td>${formatDate(item.checkin)}</td>
                <td>${formatDate(item.checkout)}</td>
                <td>${item.price}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Fetch data on page load
fetchData();