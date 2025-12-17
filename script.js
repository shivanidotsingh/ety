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
  cardContainer.innerHTML = '';

  if (dataToRender.length === 0) {
    cardContainer.innerHTML = '<div class="no-results">No results found.</div>';
    return;
  }

  // Is the "Unlikely Couples" filter active?
  const coupletFilterOn = Array.from(categoryCheckboxes)
    .some(cb => cb.checked && cb.value === 'couplet');

  // Helper to build one card element (same as your current structure)
  function buildCard(item) {
    const card = document.createElement('div');
    card.classList.add('etymology-card');

    if (item.category && item.category.includes('couplet')) {
      card.classList.add('couplet');
    }

    const displayStory = item.story && item.story.length > STORY_TRUNCATE_LIMIT
      ? item.story.substring(0, STORY_TRUNCATE_LIMIT) + '...'
      : item.story;

    const storyElement = document.createElement('p');
    storyElement.classList.add('card-story');
    storyElement.innerText = displayStory || '';

    if (item.story && item.story.length > STORY_TRUNCATE_LIMIT) {
      const readMoreSpan = document.createElement('span');
      readMoreSpan.classList.add('read-more');
      readMoreSpan.innerText = ' Read More';
      storyElement.appendChild(readMoreSpan);

      readMoreSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        showModal(item);
      });
    }

    card.innerHTML = `
      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Visual for ${item.word}" class="card-image">` : '<div class="card-image"></div>'}
      <div class="card-content">
        <h3 class="card-word">${item.word}</h3>
      </div>
    `;

    const content = card.querySelector('.card-content');
    content.appendChild(storyElement);

    const yearElement = document.createElement('p');
    yearElement.classList.add('card-year');
    yearElement.innerText = item.year || '';
    content.appendChild(yearElement);

    // default: open modal when a card is clicked
    card.addEventListener('click', () => showModal(item));

    return card;
  }

  // If couplet filter is ON, render as stacks grouped by coupletId
  if (coupletFilterOn) {
    const groups = new Map();

    dataToRender.forEach(item => {
      const key = item.coupletId || item.word; // fallback
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    groups.forEach(items => {
      // only treat as a couplet stack if it really is a pair
      if (items.length < 2) {
        cardContainer.appendChild(buildCard(items[0]));
        return;
      }

      const stack = document.createElement('div');
      stack.classList.add('couplet-stack');

      // Choose a stable order (optional): alphabetical inside pair
      items.sort((a, b) => a.word.localeCompare(b.word));

      const back = buildCard(items[0]);
      const front = buildCard(items[1]);

      back.classList.add('is-back');
      front.classList.add('is-front');

      // Click back card = bring to front (instead of immediately opening modal)
      back.addEventListener('click', (e) => {
        e.stopPropagation();
        back.classList.add('bring-front');
        front.classList.remove('bring-front');
      });

      // Click front card = ensure it's front (and open modal happens from buildCard)
      front.addEventListener('click', (e) => {
        // let modal open, but also make sure z-order feels right
        back.classList.remove('bring-front');
        front.classList.add('bring-front');
      });

      stack.appendChild(back);
      stack.appendChild(front);
      cardContainer.appendChild(stack);
    });

    return;
  }

  // Otherwise: normal grid rendering
  dataToRender.forEach(item => {
    cardContainer.appendChild(buildCard(item));
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
