// Step 1: Get Google Sheets API Credentials
// A. Go to https://console.cloud.google.com/
// B. Create a new project
// C. Enable Google Sheets API
// D. Create credentials (Service Account)
// E. Download JSON key file

const SHEET_ID = '16E6_0Y75fgPRe8Uz4nRHh5C7atbtuZtnB4i1472u180';
const API_KEY = 'AIzaSyBcn9xAwgqo9_7x4ziGzannb73Mt-QcIDA';

async function fetchPoems() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/POEMS!A:H?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // First row is headers, skip it
    const poems = data.values.slice(1).map(row => ({
      id: row[0],
      title: row[1],
      writtenFor: row[2],
      date: row[3],
      time: row[4],
      theme1: row[5],
      lineCount: row[6],
      fullText: row[7]
    }));
    
    displayPoems(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    document.querySelector('main').innerHTML = `
      <div class="text-center text-red-500">
        Error loading poems. Please check API configuration.
      </div>
    `;
  }
}

function displayPoems(poems) {
  const poemsContainer = document.querySelector('main section');
  poemsContainer.innerHTML = ''; // Clear template poem

  poems.forEach(poem => {
    // Provide default values and safe text handling
    const previewText = poem.fullText 
      ? poem.fullText.split(' ').slice(0, 20).join(' ') + '...'
      : 'No preview available';

    const poemCard = document.createElement('article');
    poemCard.className = 'poem-card p-6 space-y-4';
    poemCard.innerHTML = `
      <header>
        <h2 class="text-2xl font-semibold text-[#E53935]">
          ${poem.title || 'Untitled Poem'}
        </h2>
        <p class="text-sm text-gray-500">
          Written for: ${poem.writtenFor || 'Unknown'}
        </p>
      </header>

      <div class="text-gray-700">
        <p class="line-clamp-3">
          ${previewText}
        </p>
      </div>

      <footer class="flex justify-between items-center">
        <span class="px-3 py-1 bg-[#C8E6C9] text-[#1B5E20] rounded-full text-xs">
          ${poem.theme1 || 'Uncategorized'}
        </span>
        <button onclick="showFullPoem('${poem.id}')" class="text-[#9C27B0] hover:underline">
          Read More
        </button>
      </footer>
    `;
    
    poemsContainer.appendChild(poemCard);
  });
}

function showFullPoem(id) {
  const poem = poems.find(p => p.id === id);
  if (poem && poem.fullText) {
    alert(poem.fullText);
  } else {
    alert('Full poem text not available.');
  }
}

document.addEventListener('DOMContentLoaded', fetchPoems);
