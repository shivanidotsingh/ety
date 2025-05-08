document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('etymology-table-body');
    const categoryFilter = document.getElementById('category-filter');

    function renderTable(data) {
        tableBody.innerHTML = ''; // Clear current table body
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.word}</td>
                <td>${item.story}</td>
                <td>${item.year || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function filterTable() {
        const selectedCategory = categoryFilter.value;
        let filteredData = [];

        if (selectedCategory === 'all') {
            filteredData = etymologyData;
        } else {
            filteredData = etymologyData.filter(item => item.category === selectedCategory);
        }

        renderTable(filteredData);
    }

    // Initial render
    renderTable(etymologyData);

    // Add event listener for filtering
    categoryFilter.addEventListener('change', filterTable);
});
