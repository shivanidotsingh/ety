document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('etymology-card-container');
    const categoryCheckboxes = document.querySelectorAll('.filters input[name="category"]');
    const searchInput = document.getElementById('search-input');
    // Removed filterAllCheckbox
    const sortBySelect = document.getElementById('sort-by');
    // Removed sortDescendingCheckbox

    function renderCards(dataToRender) {
        cardContainer.innerHTML = ''; // Clear current cards

        if (dataToRender.length === 0) {
            cardContainer.innerHTML = '<div class="no-results">No results found.</div>';
            return;
        }

        dataToRender.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('etymology-card');
             // Assuming item.category is an array
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
            .filter(checkbox => checkbox.checked) // No need to check value !== 'all' anymore
            .map(checkbox => checkbox.value);

        const sortBy = sortBySelect.value;
        // Removed sortDescending


        let filteredData = etymologyData;

        // Apply category filter
        if (selectedCategories.length > 0) {
             filteredData = etymologyData.filter(item =>
                // Assuming item.category is an array and checking if any selected category is in it
                Array.isArray(item.category) && selectedCategories.some(category => item.category.includes(category))
             );
        }
        // If no specific categories are selected, the filter is not applied, effectively showing all (subject to search)


        // Apply search filter
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                item.word.toLowerCase().includes(searchTerm) ||
                item.story.toLowerCase().includes(searchTerm)
            );
        }

        // Apply Sorting Logic
        if (sortBy === 'random') {
            // Shuffle the filtered data randomly
            filteredData.sort(() => Math.random() - 0.5);
        } else if (sortBy === 'word') {
            filteredData.sort((a, b) => {
                const wordA = a.word.toLowerCase();
                const wordB = b.word.toLowerCase();
                if (wordA < wordB) return -1; // Always Ascending
                if (wordA > wordB) return 1; // Always Ascending
                return 0;
            });
        } else if (sortBy === 'year') {
             // Custom sort for years (Ascending)
             filteredData.sort((a, b) => {
                 const yearA = parseYear(a.year);
                 const yearB = parseYear(b.year);

                 if (yearA < yearB) return -1; // Always Ascending
                 if (yearA > yearB) return 1; // Always Ascending
                 return 0;
             });
        }


        renderCards(filteredData);
    }

    // Helper function to parse year strings (handles '1300s', empty strings, etc.)
    function parseYear(yearString) {
        if (!yearString) return 0; // Treat empty years as very old (or you could treat as very new)
        // Extract leading digits for sorting
        const yearMatch = String(yearString).match(/^\d+/);
        return yearMatch ? parseInt(yearMatch[0]) : 0;
    }


     // Removed "All" checkbox event listener logic

    categoryCheckboxes.forEach(checkbox => {
        // No need for special handling for the 'all' checkbox anymore
        checkbox.addEventListener('change', () => {
             filterAndSortData();
        });
    });


    // Add event listeners for filtering and sorting
    searchInput.addEventListener('input', filterAndSortData);
    sortBySelect.addEventListener('change', filterAndSortData);
    // Removed event listener for sortDescendingCheckbox


    // Initial render
    filterAndSortData();
});
