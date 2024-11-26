// Constants for Google Sheets API (not used directly here)
const SHEET_ID = '16E6_0Y75fgPRe8Uz4nRHh5C7atbtuZtnB4i1472u180';
const API_KEY = 'AIzaSyBcn9xAwgqo9_7x4ziGzannb73Mt-QcIDA';

// Toggle function for expanding/collapsing poem content
function togglePoemExpansion(id) {
  const card = document.querySelector(`[data-poem-id="${id}"]`);
  if (!card) {
    console.error(`Poem card with id ${id} not found.`);
    return;
  }

  const fullTextElement = card.querySelector('.full-poem-text');
  if (!fullTextElement) {
    console.error(`Full text element for poem id ${id} not found.`);
    return;
  }

  // Toggle visibility
  fullTextElement.classList.toggle('hidden');

  // Change button text
  const readMoreBtn = card.querySelector('.read-more-btn');
  if (readMoreBtn) {
    readMoreBtn.textContent = fullTextElement.classList.contains('hidden')
      ? 'Read More'
      : 'Collapse';
  }
}

// Function to display poems on the webpage
function displayPoems(poems) {
  const poemsContainer = document.querySelector('main section');
  if (!poemsContainer) {
    console.error('Poems container not found in the DOM.');
    return;
  }
  poemsContainer.innerHTML = ''; // Clear existing content

  poems.forEach((poem, index) => {
    // Create poem card
    const poemCard = document.createElement('article');
    poemCard.className = 'poem-card p-6 space-y-4';
    poemCard.setAttribute('data-poem-id', index);

    // Build the card content
    poemCard.innerHTML = `
      <header>
        <h2 class="text-2xl font-semibold text-[#E53935]">${poem.title}</h2>
        <p class="text-sm text-gray-500">Written for: ${poem.dedication}</p>
      </header>
      <div class="text-gray-700">
        <p class="line-clamp-3">${poem.preview}</p>
        <p class="full-poem-text hidden">${poem.fullText}</p>
      </div>
      <footer class="flex justify-between items-center">
        <span class="px-3 py-1 bg-[#C8E6C9] text-[#1B5E20] rounded-full text-xs">${poem.theme}</span>
        <button class="read-more-btn text-[#9C27B0] hover:underline" onclick="togglePoemExpansion(${index})">
          Read More
        </button>
      </footer>
    `;

    // Add card to container
    poemsContainer.appendChild(poemCard);
  });
}

// Example poems array (replace with actual data from API or other source)
const examplePoems = [
  {
    title: 'Sunrise Memories',
    dedication: 'My Mother',
    preview: 'Soft rays pierce through morning mist, Memories dance like gentle whispers...',
    fullText: 'Soft rays pierce through morning mist,\nMemories dance like gentle whispers...\nLonging hearts find solace.',
    theme: 'Family'
  },
  {
    title: 'Nature\'s Harmony',
    dedication: 'Nature Enthusiasts',
    preview: 'Leaves rustle in the gentle breeze, a symphony of nature unfolds...',
    fullText: 'Leaves rustle in the gentle breeze,\nA symphony of nature unfolds,\nBringing peace to wandering souls.',
    theme: 'Nature'
  }
];

// Display example poems (replace with real data when available)
document.addEventListener('DOMContentLoaded', () => {
  displayPoems(examplePoems);
});
