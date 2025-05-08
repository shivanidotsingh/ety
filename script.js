document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('etymology-table-body');
    const categoryCheckboxes = document.querySelectorAll('.filters input[name="category"]');
    const searchInput = document.getElementById('search-input');
    const filterAllCheckbox = document.getElementById('filter-all');

    function renderTable(dataToRender, isCoupletFilteredOnly) {
        tableBody.innerHTML = ''; // Clear current table body

        if (isCoupletFilteredOnly) {
             // Group couplets by coupletId when ONLY couplets filter is active
            const coupletsGrouped = dataToRender.reduce((acc, item) => {
                (acc[item.coupletId] = acc[item.coupletId] || []).push(item);
                return acc;
            }, {});

            // Render grouped couplets
            for (const coupletId in coupletsGrouped) {
                const coupletEntries = coupletsGrouped[coupletId];
                const row = document.createElement('tr');
                row.classList.add('couplet-group'); // Add class for styling
                row.innerHTML = `
                    <td>${coupletEntries.map(c => c.word).join(' and ')}</td>
                    <td>${coupletEntries.map(c => c.story).join('<br><br>')}</td>
                    <td>${coupletEntries.map(c => c.year || '').filter(Boolean).join(', ')}</td>
                `;
                tableBody.appendChild(row);
            }

        } else {
            // Render all other filtered entries individually
            dataToRender.forEach(item => {
                const row = document.createElement('tr');
                 // Do not add couplet-group class for individual display
                row.innerHTML = `
                    <td>${item.word}</td>
                    <td>${item.story}</td>
                    <td>${item.year || ''}</td>
                `;
                tableBody.appendChild(row);
            });
        }
         // Show "No results" if table is empty
        if (tableBody.children.length === 0) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = `<td colspan="3" style="text-align: center;">No results found.</td>`;
            tableBody.appendChild(noResultsRow);
        }
    }

    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked && checkbox.value !== 'all')
            .map(checkbox => checkbox.value);

        let filteredData = etymologyData;

        // Apply category filter
        if (selectedCategories.length > 0) {
            filteredData = etymologyData.filter(item => selectedCategories.includes(item.category));
        } else if (!filterAllCheckbox.checked) {
             // If no specific categories are selected and "All" is not checked, show nothing
            filteredData = [];
        }
        // If no specific categories are selected and "All" is checked, all data is already in filteredData

        // Apply search filter
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                item.word.toLowerCase().includes(searchTerm) ||
                item.story.toLowerCase().includes(searchTerm)
            );
        }

         // Determine if ONLY couplets are filtered
        const isCoupletFilteredOnly = selectedCategories.length === 1 && selectedCategories[0] === 'couplet' && !searchTerm;


        renderTable(filteredData, isCoupletFilteredOnly);
    }

    // Handle "All" checkbox logic
    filterAllCheckbox.addEventListener('change', () => {
        if (filterAllCheckbox.checked) {
            categoryCheckboxes.forEach(checkbox => {
                if (checkbox.value !== 'all') {
                    checkbox.checked = false;
                }
            });
        }
        filterTable();
    });

    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.value !== 'all') {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    filterAllCheckbox.checked = false;
                } else {
                    // If no specific categories are checked, check "All"
                    if (Array.from(categoryCheckboxes).filter(cb => cb.checked && cb.value !== 'all').length === 0) {
                         filterAllCheckbox.checked = true;
                    }
                }
                filterTable();
            });
        }
    });


    // Add event listeners for filtering
    searchInput.addEventListener('input', filterTable);
    // Event listeners for category checkboxes are added above

    // Initial render
    filterTable();
});
