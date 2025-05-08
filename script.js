document.addEventListener('DOMContentLoaded', () => {

    const cardContainer = document.getElementById('etymology-card-container');
    const categoryCheckboxes = document.querySelectorAll('.filters input[name="category"]');
    const searchInput = document.getElementById('search-input');
    const filterAllCheckbox = document.getElementById('filter-all');
    const sortBySelect = document.getElementById('sort-by');
    const sortDescendingCheckbox = document.getElementById('sort-descending');

    function renderCards(dataToRender) {
        cardContainer.innerHTML = ''; // Clear current cards

        if (dataToRender.length === 0) {
            cardContainer.innerHTML = '<div class="no-results">No results found.</div>';
            return;
        }

        dataToRender.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('etymology-card');
            // Check if 'couplet' is one of the categories in the array
             if (item.category && item.category.includes('couplet')) {
                 card.classList.add('couplet'); // Add class for couplet styling
             }

            card.innerHTML = `
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Visual for ${item.word}" class="card-image">` : '<div class="card-image"></div>'}
                <div class="card-content">
                    <h3 class="card-word">${item.word}</h3>
                    <p class="card-story">${item.story}</p>
                    <p class="card-year">${item.year || ''}</p>
                </div>
            `;
            cardContainer.appendChild(card);
        });
    }

    function filterAndSortData() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked && checkbox.value !== 'all')
            .map(checkbox => checkbox.value);

        const sortBy = sortBySelect.value;
        const sortDescending = sortDescendingCheckbox.checked;

        let filteredData = etymologyData;

        // Apply category filter - UPDATED LOGIC
        if (selectedCategories.length > 0) {
             filteredData = etymologyData.filter(item =>
                 item.category && selectedCategories.some(category => item.category.includes(category))
             );
        } else if (!filterAllCheckbox.checked) {
            filteredData = [];
        }

        // Apply search filter
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                item.word.toLowerCase().includes(searchTerm) ||
                item.story.toLowerCase().includes(searchTerm)
            );
        }

        // --- Sorting Logic ---
        let sortedData = filteredData;

        if (sortBy === 'word') {
            sortedData.sort((a, b) => {
                const wordA = a.word.toLowerCase();
                const wordB = b.word.toLowerCase();
                if (wordA < wordB) return sortDescending ? 1 : -1;
                if (wordA > wordB) return sortDescending ? -1 : 1;
                return 0;
            });
        } else if (sortBy === 'year') {
             sortedData.sort((a, b) => {
                 // Basic numeric sort - handles empty years by treating as 0
                 const yearA = parseInt(String(a.year).replace(/\D/g, '')) || 0; // Extract numbers
                 const yearB = parseInt(String(b.year).replace(/\D/g, '')) || 0; // Extract numbers

                 if (yearA < yearB) return sortDescending ? 1 : -1;
                 if (yearA > yearB) return sortDescending ? -1 : 1;
                 return 0;
             });
        }


        renderCards(sortedData);
    }

     // Handle "All" checkbox logic
    filterAllCheckbox.addEventListener('change', () => {
        if (filterAllCheckbox.checked) {
            categoryCheckboxes.forEach(checkbox => {
                if (checkbox.value !== 'all') {
                    checkbox.checked = false;
                }
            });
        } else {
             if (Array.from(categoryCheckboxes).filter(cb => cb.checked && cb.value !== 'all').length === 0) {
                 filterAllCheckbox.checked = true;
             }
        }
        filterAndSortData();
    });

    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.value !== 'all') {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    filterAllCheckbox.checked = false;
                } else {
                    if (Array.from(categoryCheckboxes).filter(cb => cb.checked && cb.value !== 'all').length === 0) {
                         filterAllCheckbox.checked = true;
                    }
                }
                filterAndSortData();
            });
        }
    });


    // Add event listeners for filtering and sorting
    searchInput.addEventListener('input', filterAndSortData);
    sortBySelect.addEventListener('change', filterAndSortData);
    sortDescendingCheckbox.addEventListener('change', filterAndSortData);


    // Initial render
    filterAndSortData();
});
