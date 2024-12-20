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

function displayPoems(poems) {
  const poemsContainer = document.querySelector('main section');
  poemsContainer.innerHTML = '';

  poems.forEach(poem => {
    const poemCard = document.createElement('article');
    poemCard.className = 'poem-card p-6 space-y-4 cursor-pointer';
    poemCard.setAttribute('data-poem-id', poem.id);
    
    // Theme background color
    const themeColor = themeColors[poem.theme1] || themeColors['Uncategorized'];

    
    poemCard.innerHTML = `
      <header>
        <h2 class="text-2xl font-semibold text-[#E53935]">
          ${poem.title}
        </h2>
        <p class="text-sm text-gray-500 flex items-center gap-2">
          <span 
            class="px-2 py-1 rounded-full text-xs"
            style="background-color: ${themeColor}"
          >
            ${poem.theme1}
          </span>
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
  });
}

function filterPoems(type, value) {
  const allPoems = document.querySelectorAll('.poem-card');
  
  const filteredPoems = Array.from(allPoems).filter(poem => {
    // If 'All' is selected, show all poems
    if (value === 'All') return true;
    
    return type === 'theme' 
      ? poem.querySelector('.text-xs').textContent.trim() === value.trim()
      : false;
  });
  
  // Hide all poems first
  allPoems.forEach(p => p.classList.add('hidden'));
  
  // Show filtered poems
  filteredPoems.forEach(p => p.classList.remove('hidden'));
}

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
