// Step 1: Get Google Sheets API Credentials
// A. Go to https://console.cloud.google.com/
// B. Create a new project
// C. Enable Google Sheets API
// D. Create credentials (Service Account)
// E. Download JSON key file

const SHEET_ID = '16E6_0Y75fgPRe8Uz4nRHh5C7atbtuZtnB4i1472u180';
const API_KEY = '5fe7796ecd46e90ef04d681f099276b2a17a765b';

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
  }
}

function displayPoems(poems) {
  const poemsContainer = document.getElementById('poems-container');
  
  poems.forEach(poem => {
    const poemCard = document.createElement('div');
    poemCard.className = 'poem-card';
    poemCard.innerHTML = `
      <h3>${poem.title}</h3>
      <p>Written for: ${poem.writtenFor}</p>
      <p>Date: ${poem.date}</p>
      <p>Theme: ${poem.theme1}</p>
      <button onclick="showFullPoem('${poem.id}')">Read Poem</button>
    `;
    
    poemsContainer.appendChild(poemCard);
  });
}

function showFullPoem(id) {
  const poem = poems.find(p => p.id === id);
  alert(poem.fullText);  // Simple implementation
}
// Call when page loads
document.addEventListener('DOMContentLoaded', fetchPoems);
