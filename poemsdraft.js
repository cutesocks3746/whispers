// Step 1: Get Google Sheets API Credentials
// A. Go to https://console.cloud.google.com/
// B. Create a new project
// C. Enable Google Sheets API
// D. Create credentials (Service Account)
// E. Download JSON key file

const SHEET_ID = '16E6_0Y75fgPRe8Uz4nRHh5C7atbtuZtnB4i1472u180';
const API_KEY = 'AIzaSyBcn9xAwgqo9_7x4ziGzannb73Mt-QcIDA';

let poems = []; // Global variable to store poems

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
    
    console.log('Processed poems:', poems); // Debug logging
    displayPoems(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
  }
}

function togglePoemExpansion(id) {
  const card = document.querySelector(`[data-poem-id="${id}"]`);
  const fullTextElement = card.querySelector('.full-poem-text');
  
  fullTextElement.classList.toggle('hidden');
  
  // Change button text
  const readMoreBtn = card.querySelector('.read-more-btn');
  readMoreBtn.textContent = fullTextElement.classList.contains('hidden') 
    ? 'Read More' 
    : 'Collapse';
}

function displayPoems(poems) {
  const poemsContainer = document.querySelector('main section');
  poemsContainer.innerHTML = '';

  poems.forEach(poem => {
    const poemCard = document.createElement('article');
    poemCard.className = 'poem-card p-6 space-y-4';
    poemCard.setAttribute('data-poem-id', poem.id);
    
    poemCard.innerHTML = `
      <header>
        <h2 class="text-2xl font-semibold text-[#E53935]">
          ${poem.title}
        </h2>
        <p class="text-sm text-gray-500">
          Written on: <span class="filter-link" data-type="person">${poem.date}</span>
        </p>
      </header>

      <div class="text-gray-700">
        <p class="line-clamp-3 preview-text">
          ${poem.fullText.split('\n').slice(0, 3).join('<br>')}
        </p>
        <div class="full-poem-text hidden whitespace-pre-line">
          ${poem.fullText}
        </div>
      </div>

      <footer class="flex justify-between items-center">
        <span class="px-3 py-1 bg-[#C8E6C9] text-[#1B5E20] rounded-full text-xs">
          <span class="filter-link" data-type="theme">${poem.theme1}</span>
        </span>
        <button 
          onclick="togglePoemExpansion('${poem.id}')" 
          class="read-more-btn text-[#9C27B0] hover:underline"
        >
          Read More
        </button>
      </footer>
    `;
    
    poemsContainer.appendChild(poemCard);
  });

  // Add event listeners for filtering
  document.querySelectorAll('.filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const filterType = e.target.dataset.type;
      const filterValue = e.target.textContent;
      filterPoems(filterType, filterValue);
    });
  });
}

function filterPoems(type, value) {
  const allPoems = document.querySelectorAll('.poem-card');
  const filteredPoems = Array.from(allPoems).filter(poem => {
    return type === 'person' 
      ? poem.querySelector('[data-type="person"]').textContent === value
      : poem.querySelector('[data-type="theme"]').textContent === value;
  });

  // Hide/show poems
  allPoems.forEach(p => p.classList.add('hidden'));
  filteredPoems.forEach(p => p.classList.remove('hidden'));

  // Add back button
  const mainSection = document.querySelector('main section');
  const backButton = document.createElement('button');
  backButton.textContent = 'Back to All Poems';
  backButton.className = 'mx-auto block my-4 px-4 py-2 bg-[#00BCD4] text-white rounded-full';
  backButton.addEventListener('click', resetPoemView);
  mainSection.insertBefore(backButton, mainSection.firstChild);
}

function resetPoemView() {
  const allPoems = document.querySelectorAll('.poem-card');
  allPoems.forEach(p => p.classList.remove('hidden'));
  
  // Remove back button
  const backButton = document.querySelector('main section button');
  if (backButton) backButton.remove();
}

// Add search functionality
function searchPoems() {
  const searchInput = document.getElementById('poem-search');
  const searchTerm = searchInput.value.toLowerCase();
  
  const allPoems = document.querySelectorAll('.poem-card');
  
  allPoems.forEach(poem => {
    const title = poem.querySelector('h2').textContent.toLowerCase();
    const fullText = poem.querySelector('.full-poem-text').textContent.toLowerCase();
    //const writtenFor = poem.querySelector('[data-type="person"]').textContent.toLowerCase();
    const theme = poem.querySelector('[data-type="theme"]').textContent.toLowerCase();
    
    const match = title.includes(searchTerm) || 
                  fullText.includes(searchTerm) || 
      //            writtenFor.includes(searchTerm) || 
                  theme.includes(searchTerm);
    
    poem.classList.toggle('hidden', !match);
  });
}
function showFullPoem(id) {
  const poem = poems.find(p => p.id === id);
  if (poem) {
    alert(poem.fullText);
  }
}

document.addEventListener('DOMContentLoaded', fetchPoems);
