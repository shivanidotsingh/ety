document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('etymology-card-container');
    const categoryCheckboxes = document.querySelectorAll('.filters input[name="category"]');
    const searchInput = document.getElementById('search-input');
    const filterAllCheckbox = document.getElementById('filter-all');

    function renderCards(dataToRender) {
        cardContainer.innerHTML = ''; // Clear current cards

        if (dataToRender.length === 0) {
            cardContainer.innerHTML = '<div class="no-results">No results found.</div>';
            return;
        }

        dataToRender.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('etymology-card');
             if (item.category === 'couplet') {
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

    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked && checkbox.value !== 'all')
            .map(checkbox => checkbox.value);

        let filteredData = etymologyData;

        // Apply category filter
        if (selectedCategories.length > 0) {
            filteredData = etymologyData.filter(item => selectedCategories.includes(item.category));
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

        renderCards(filteredData);
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
        filterData();
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
                filterData();
            });
        }
    });


    // Add event listeners for filtering
    searchInput.addEventListener('input', filterData);

    // Initial render
    filterData();
});
