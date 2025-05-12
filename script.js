document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('etymology-card-container');
    const categoryCheckboxes = document.querySelectorAll('.filters input[name="category"]');
    const searchInput = document.getElementById('search-input');
    const sortBySelect = document.getElementById('sort-by');

    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modalCloseButton = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalWord = document.getElementById('modal-word');
    const modalStory = document.getElementById('modal-story');
    const modalYear = document.getElementById('modal-year');

    const STORY_TRUNCATE_LIMIT = 250; // Define character limit for truncating stories

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

            // Truncate story if it's long
            const displayStory = item.story && item.story.length > STORY_TRUNCATE_LIMIT
                ? item.story.substring(0, STORY_TRUNCATE_LIMIT) + '...'
                : item.story;

            const storyElement = document.createElement('p');
            storyElement.classList.add('card-story');
            storyElement.innerText = displayStory; // Use innerText to avoid rendering HTML tags in truncated story

            if (item.story && item.story.length > STORY_TRUNCATE_LIMIT) {
                const readMoreSpan = document.createElement('span');
                readMoreSpan.classList.add('read-more');
                readMoreSpan.innerText = ' Read More';
                readMoreSpan.dataset.word = item.word; // Store word to easily find full data later
                storyElement.appendChild(readMoreSpan);

                // Add event listener to the "Read More" span
                readMoreSpan.addEventListener('click', () => {
                     showModal(item); // Pass the full item data to showModal
                });
            }


            card.innerHTML = `
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Visual for ${item.word}" class="card-image">` : '<div class="card-image"></div>'}
                <div class="card-content">
                    <h3 class="card-word">${item.word}</h3>
                    </div> `;
            card.querySelector('.card-content').appendChild(storyElement); // Append story element
             const yearElement = document.createElement('p');
             yearElement.classList.add('card-year');
             yearElement.innerText = item.year || '';
             card.querySelector('.card-content').appendChild(yearElement); // Append year element


            cardContainer.appendChild(card);
        });
    }

    function filterAndSortData() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const sortBy = sortBySelect.value;

        let filteredData = etymologyData;

        // Apply category filter
        if (selectedCategories.length > 0) {
             filteredData = etymologyData.filter(item =>
                // Ensure item.category is an array before checking for inclusion
                Array.isArray(item.category) && selectedCategories.some(category => item.category.includes(category))
             );
        }

        // Apply search filter
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                item.word.toLowerCase().includes(searchTerm) ||
                (item.story && item.story.toLowerCase().includes(searchTerm))
            );
        }

        // Apply Sorting Logic
        if (sortBy === 'random') {
            filteredData.sort(() => Math.random() - 0.5);
        } else if (sortBy === 'word') {
            filteredData.sort((a, b) => {
                const wordA = a.word.toLowerCase();
                const wordB = b.word.toLowerCase();
                if (wordA < wordB) return -1; // Ascending
                if (wordA > wordB) return 1; // Ascending
                return 0;
            });
        } else if (sortBy === 'year') {
             filteredData.sort((a, b) => {
                 const yearA = parseYear(a.year);
                 const yearB = parseYear(b.year);

                 if (yearA < yearB) return -1; // Ascending
                 if (yearA > yearB) return 1; // Ascending
                 return 0;
             });
        }

        renderCards(filteredData);
    }

    // Helper function to parse year strings
    function parseYear(yearString) {
        if (!yearString) return 0;
        const yearMatch = String(yearString).match(/^\d+/);
        return yearMatch ? parseInt(yearMatch[0]) : 0;
    }

    // Modal Functions
    function showModal(item) {
        modalWord.innerText = item.word;
        modalStory.innerText = item.story; // Display full story
        modalYear.innerText = item.year || '';

        if (item.imageUrl) {
            modalImage.src = item.imageUrl;
            modalImage.style.display = 'block';
        } else {
            modalImage.src = '';
            modalImage.style.display = 'none';
        }

        modalOverlay.classList.add('visible'); // Show the modal
        document.body.style.overflow = 'hidden'; // Prevent scrolling the background
    }

    function hideModal() {
        modalOverlay.classList.remove('visible'); // Hide the modal
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close modal when clicking outside the modal content
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hideModal();
        }
    });

    // Close modal when clicking the close button
    modalCloseButton.addEventListener('click', hideModal);


    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterAndSortData);
    });

    searchInput.addEventListener('input', filterAndSortData);
    sortBySelect.addEventListener('change', filterAndSortData);

    // Initial render
    filterAndSortData();
});
