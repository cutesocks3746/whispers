// Step 1: Get Google Sheets API Credentials
// A. Go to https://console.cloud.google.com/
// B. Create a new project
// C. Enable Google Sheets API
// D. Create credentials (Service Account)
// E. Download JSON key file

const SHEET_ID = '16E6_0Y75fgPRe8Uz4nRHh5C7atbtuZtnB4i1472u180';
const API_KEY = 'AIzaSyBcn9xAwgqo9_7x4ziGzannb73Mt-QcIDA';

let poems = []; // Global variable to store poems
let uniqueThemes = new Set(); // To track unique themes

// Theme color palette (expand as needed)
const themeColors = {
  'Love': '#FFD1DC',      // Pastel Pink
  'Nature': '#C8E6C9',    // Light Green
  'Friendship': '#B3E5FC',// Light Blue
  'Life': '#FFECB3',      // Light Yellow
  'Broken Relationships': '#FFB6C1',      // Light Pink
  'Christian Life': '#E6E6FA',      // Light Purple
  'Inspiration': '#B2EBF2',      // Light Cyan
  'Loss': '#FFC107',      // Amber Yellow
  'Uncategorized': '#E0E0E0' // Light Gray
};

async function fetchPoems() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/POEMS!A:I?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Raw data:', data); // Debug logging
    
    // Ensure values exist and is an array
    if (!data.values || !Array.isArray(data.values)) {
      console.error('No valid data found');
      return;
    }
    
    // Map the data, ensuring each poem has all properties
    poems = data.values.slice(1).map(row => ({
      id: row[0] || '',
      title: row[1] || 'Untitled',
      writtenFor: row[2] || 'Unknown',
      date: row[3] || '',
      time: row[4] || '',
      theme1: row[5] || 'Uncategorized',
      lineCount: row[7] || '',
      fullText: row[8] || 'No text available'
    }));
    
    // Collect unique themes
    uniqueThemes = new Set(poems.map(poem => poem.theme1));
    
    console.log('Processed poems:', poems); // Debug logging
    displayThemeFilter();
    displayPoems(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
  }
}

function displayThemeFilter() {
  const mainContainer = document.querySelector('main');
  if (!mainContainer) {
    console.error('No main container found for theme filter');
    return;
  }
  const themeContainer = document.createElement('div');
  themeContainer.className = 'theme-filter flex flex-wrap justify-center gap-2 mb-6';
  
  // Add 'All' button first
  const allButton = document.createElement('button');
  allButton.textContent = 'All';
  allButton.className = 'px-3 py-1 rounded-full text-xs font-medium';
  allButton.style.backgroundColor = '#00ffff'; // Full cyan color
  allButton.addEventListener('click', () => filterPoems('theme', 'All'));
  
  themeContainer.appendChild(allButton);
  
  // Add existing theme buttons
  uniqueThemes.forEach(theme => {
    const themeButton = document.createElement('button');
    themeButton.textContent = theme;
    themeButton.className = 'px-3 py-1 rounded-full text-xs font-medium';
    themeButton.style.backgroundColor = themeColors[theme] || themeColors['Uncategorized'];
    themeButton.addEventListener('click', () => filterPoems('theme', theme));
    
    themeContainer.appendChild(themeButton);
  });
  
  // Insert the theme filter at the beginning of the main container
  mainContainer.insertBefore(themeContainer, mainContainer.firstChild);
}

function togglePoemExpansion(id) {
  const card = document.querySelector(`[data-poem-id="${id}"]`);
  const fullTextElement = card.querySelector('.full-poem-text');
  const previewTextElement = card.querySelector('.preview-text');
  
  fullTextElement.classList.toggle('hidden');
  previewTextElement.classList.toggle('hidden');
}

function processThemes(themeString) {
  // Split themes by comma and trim whitespace
  return themeString.split(',').map(theme => theme.trim());
}

function displayPoems(poems) {
  const poemsContainer = document.querySelector('main section');
  poemsContainer.innerHTML = '';

  // Add grid layout with responsive centering
  poemsContainer.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center';

  poems.forEach(poem => {
    const poemCard = document.createElement('article');
    poemCard.className = 'poem-card p-6 space-y-4 cursor-pointer w-full';
    poemCard.setAttribute('data-poem-id', poem.id);
    
    // Process themes (split by comma if multiple)
    const poemThemes = poem.theme1.split(',').map(theme => theme.trim());
    
    // Generate theme color spans
    const themeSpans = poemThemes.map(theme => {
      const themeColor = themeColors[theme] || themeColors['Uncategorized'];
      return `
        <span 
          class="px-2 py-1 rounded-full text-xs mr-1 inline-block"
          style="background-color: ${themeColor}"
        >
          ${theme}
        </span>
      `;
    }).join('');

    poemCard.innerHTML = `
      <header>
        <h2 class="text-2xl font-semibold text-[#E53935]">
          ${poem.title}
        </h2>
        <p class="text-sm text-gray-500 flex items-center gap-2 mb-2">
          ${themeSpans}
        </p>
        <p class="text-sm text-gray-500 flex items-center gap-2">
          Written on: ${poem.date}
        </p>
      </header>

      <div class="text-gray-700">
        <div class="preview-text line-clamp-6">
          ${poem.fullText.split('\n').slice(0, 6).join('<br>')}
        </div>
        <div class="full-poem-text hidden whitespace-pre-line">
          ${poem.fullText}
        </div>
      </div>
    `;
    
    // Add click event to entire card to toggle expansion
    poemCard.addEventListener('click', () => togglePoemExpansion(poem.id));
    
    poemsContainer.appendChild(poemCard);

    // NEW CODE: Add copy link functionality
    const link = generatePoemLink(poem.id);
    const copyLinkButton = document.createElement('button');
    copyLinkButton.innerHTML = '🔗 Copy Link';
    copyLinkButton.className = 'absolute top-2 right-2 bg-gray-100 p-2 rounded-full'; // Optional styling
    copyLinkButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent card expansion when clicking button
      navigator.clipboard.writeText(link);
      alert('Poem link copied!');
    });
    
    // Append the copy link button to the poem card
    poemCard.appendChild(copyLinkButton);
  });
}

// You'll also need to update the theme filter function
function displayThemeFilter() {
  const mainContainer = document.querySelector('main');
  if (!mainContainer) {
    console.error('No main container found for theme filter');
    return;
  }
  const themeContainer = document.createElement('div');
  themeContainer.className = 'theme-filter flex flex-wrap justify-center gap-2 mb-6';
  
  // Add 'All' button first
  const allButton = document.createElement('button');
  allButton.textContent = 'All';
  allButton.className = 'px-3 py-1 rounded-full text-xs font-medium';
  allButton.style.backgroundColor = '#00ffff'; // Full cyan color
  allButton.addEventListener('click', () => filterPoems('theme', 'All'));
  
  themeContainer.appendChild(allButton);
  
  // Collect unique themes by splitting and trimming
  const allThemes = new Set();
  poems.forEach(poem => {
    poem.theme1.split(',').forEach(theme => {
      allThemes.add(theme.trim());
    });
  });
  
  // Add theme buttons
  allThemes.forEach(theme => {
    const themeButton = document.createElement('button');
    themeButton.textContent = theme;
    themeButton.className = 'px-3 py-1 rounded-full text-xs font-medium';
    themeButton.style.backgroundColor = themeColors[theme] || themeColors['Uncategorized'];
    themeButton.addEventListener('click', () => filterPoems('theme', theme));
    
    themeContainer.appendChild(themeButton);
  });
  
  // Insert the theme filter at the beginning of the main container
  mainContainer.insertBefore(themeContainer, mainContainer.firstChild);
}

// Update filterPoems function to handle multiple themes
function filterPoems(type, value) {
  const allPoems = document.querySelectorAll('.poem-card');
  
  const filteredPoems = Array.from(allPoems).filter(poem => {
    // If 'All' is selected, show all poems
    if (value === 'All') return true;
    
    // Check if the theme exists in the poem's themes
    if (type === 'theme') {
      const themeSpans = poem.querySelectorAll('.text-xs');
      return Array.from(themeSpans).some(span => 
        span.textContent.trim() === value.trim()
      );
    }
    
    return false;
  });
  
  // Hide all poems first
  allPoems.forEach(p => p.classList.add('hidden'));
  
  // Show filtered poems
  filteredPoems.forEach(p => p.classList.remove('hidden'));
}

//        <p class="text-sm text-gray-500 flex items-center gap-2">

function generatePoemLink(poemId) {
  // Create a unique URL hash for each poem
  return `${window.location.origin}${window.location.pathname}#poem/${poemId}`;
}


function setupPoemLinking() {
  // Parse URL hash on page load
  const hash = window.location.hash;
  if (hash.startsWith('#poem/')) {
    const poemId = hash.split('/')[1];
    const poemCard = document.querySelector(`[data-poem-id="${poemId}"]`);
    if (poemCard) {
      // Scroll to the poem
      poemCard.scrollIntoView({ behavior: 'smooth' });
      
      // Optionally expand the poem
      togglePoemExpansion(poemId);
    }
  }
}

// Call this after fetchPoems() completes
document.addEventListener('DOMContentLoaded', () => {
  fetchPoems();
  setupPoemLinking();
});

function resetPoemView() {
  const allPoems = document.querySelectorAll('.poem-card');
  allPoems.forEach(p => p.classList.remove('hidden'));
  
  // Remove back button
  const backButton = document.querySelector('main section button');
  if (backButton) backButton.remove();
}

function searchPoems() {
  const searchInput = document.getElementById('poem-search');
  const searchTerm = searchInput.value.toLowerCase();
  
  const allPoems = document.querySelectorAll('.poem-card');
  
  allPoems.forEach(poem => {
    const title = poem.querySelector('h2').textContent.toLowerCase();
    const fullText = poem.querySelector('.full-poem-text').textContent.toLowerCase();
    const theme = poem.querySelector('.text-xs').textContent.toLowerCase();
    
    const match = title.includes(searchTerm) || 
                  fullText.includes(searchTerm) || 
                  theme.includes(searchTerm);
    
    poem.classList.toggle('hidden', !match);
  });
}

document.addEventListener('DOMContentLoaded', fetchPoems);
