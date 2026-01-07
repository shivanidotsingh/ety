document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById('etymology-card-container');
  const categoryCheckboxes = document.querySelectorAll('.filters input[name="category"]');
  const sortBySelect = document.getElementById('sort-by');

  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseButton = document.getElementById('modal-close');
  const modalWord = document.getElementById('modal-word');
  const modalStory = document.getElementById('modal-story');
  const modalYear = document.getElementById('modal-year');

  const STORY_TRUNCATE_LIMIT = 250;

  function renderCards(dataToRender) {
    cardContainer.innerHTML = '';

    if (dataToRender.length === 0) {
      cardContainer.innerHTML = '<div class="no-results">No results found.</div>';
      return;
    }

    // Is the "Unlikely Couples" filter active?
    const coupletFilterOn = Array.from(categoryCheckboxes)
      .some(cb => cb.checked && cb.value === 'couplet');

    function buildCard(item) {
      const card = document.createElement('div');
      card.classList.add('etymology-card');

      if (Array.isArray(item.category) && item.category.includes('couplet')) {
        card.classList.add('couplet');
      }

      const displayStory =
        item.story && item.story.length > STORY_TRUNCATE_LIMIT
          ? item.story.substring(0, STORY_TRUNCATE_LIMIT) + '...'
          : (item.story || '');

      const storyElement = document.createElement('p');
      storyElement.classList.add('card-story');
      storyElement.innerText = displayStory;

      // ✅ ONLY "Read More" opens the modal
      if (item.story && item.story.length > STORY_TRUNCATE_LIMIT) {
        const readMoreSpan = document.createElement('span');
        readMoreSpan.classList.add('read-more');
        readMoreSpan.innerText = ' Read More';

        readMoreSpan.addEventListener('click', (e) => {
          e.stopPropagation(); // prevents triggering couplet swap click
          showModal(item);
        });

        storyElement.appendChild(readMoreSpan);
      }

      card.innerHTML = `
        ${item.imageUrl
          ? `<img src="${item.imageUrl}" alt="Visual for ${item.word}" class="card-image">`
          : `<div class="card-image"></div>`
        }
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

      // 🚫 IMPORTANT: no card click handler here
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
        // If it isn't a real pair, just render normally
        if (items.length < 2) {
          cardContainer.appendChild(buildCard(items[0]));
          return;
        }

        const stack = document.createElement('div');
        stack.classList.add('couplet-stack');

        // Optional stable order inside the pair
        items.sort((a, b) => a.word.localeCompare(b.word));

        const cardA = buildCard(items[0]);
        const cardB = buildCard(items[1]);

        // Start with A in back, B in front
        cardA.classList.add('is-back');
        cardB.classList.add('is-front');

        function swapIfBack(clickedCard, otherCard) {
          return (e) => {
            e.stopPropagation();

            // only swap if you clicked the one that is currently in the back
            if (!clickedCard.classList.contains('is-back')) return;

            clickedCard.classList.remove('is-back');
            clickedCard.classList.add('is-front');

            otherCard.classList.remove('is-front');
            otherCard.classList.add('is-back');
          };
        }

        // ✅ Attach to BOTH cards so swapping can happen forever
        cardA.addEventListener('click', swapIfBack(cardA, cardB));
        cardB.addEventListener('click', swapIfBack(cardB, cardA));

        stack.appendChild(cardA);
        stack.appendChild(cardB);
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
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    const sortBy = sortBySelect.value;

    let filteredData = etymologyData;

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredData = etymologyData.filter(item =>
        Array.isArray(item.category) &&
        selectedCategories.some(category => item.category.includes(category))
      );
    }



    // Apply Sorting Logic
    if (sortBy === 'random') {
      filteredData.sort(() => Math.random() - 0.5);
    } else if (sortBy === 'word') {
      filteredData.sort((a, b) => {
        const wordA = a.word.toLowerCase();
        const wordB = b.word.toLowerCase();
        if (wordA < wordB) return -1;
        if (wordA > wordB) return 1;
        return 0;
      });
    } else if (sortBy === 'year') {
      filteredData.sort((a, b) => {
        const yearA = parseYear(a.year);
        const yearB = parseYear(b.year);
        if (yearA < yearB) return -1;
        if (yearA > yearB) return 1;
        return 0;
      });
    }

    renderCards(filteredData);
  }

  function parseYear(yearString) {
    if (!yearString) return 0;
    const yearMatch = String(yearString).match(/^\d+/);
    return yearMatch ? parseInt(yearMatch[0], 10) : 0;
  }

  // Modal Functions
  function showModal(item) {
    modalWord.innerText = item.word;
    modalStory.innerText = item.story || '';
    modalYear.innerText = item.year || '';

    modalOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modalOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) hideModal();
  });

  modalCloseButton.addEventListener('click', hideModal);

  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterAndSortData);
  });

  sortBySelect.addEventListener('change', filterAndSortData);

  filterAndSortData();
});
