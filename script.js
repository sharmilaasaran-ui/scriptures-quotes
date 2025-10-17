// Replace YOUR_SHEET_ID with your actual sheet ID
const SHEET_ID = '1cbX2Vbb6wRdKjv5x7oLsLGGR9CD146K3VB8L-ViuVwc';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

let quotes = [];

// Load quotes when page loads
window.onload = function() {
    loadQuotes();
};

async function loadQuotes() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        // Parse CSV data
        const rows = data.split('\n');
        
        for (let i = 1; i < rows.length; i++) {
            const columns = parseCSVRow(rows[i]);
            if (columns.length >= 3) {
                quotes.push({
                    category: columns[0].replace(/"/g, ''),
                    quote: columns[1].replace(/"/g, ''),
                    reference: columns[2].replace(/"/g, '')
                });
            }
        }
    } catch (error) {
        console.error('Error loading quotes:', error);
    }
}

function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

function getQuote() {
    const category = document.getElementById('category').value;
    
    if (!category) {
        alert('Please select a category');
        return;
    }
    
    // Filter quotes by category
    const categoryQuotes = quotes.filter(q => q.category === category);
    
    if (categoryQuotes.length === 0) {
        alert('No quotes found for this category');
        return;
    }
    
    // Get random quote from category
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    const selectedQuote = categoryQuotes[randomIndex];
    
    // Display quote
    document.getElementById('quoteText').textContent = selectedQuote.quote;
    document.getElementById('quoteReference').textContent = '- ' + selectedQuote.reference;
    document.getElementById('quoteBox').style.display = 'block';
}
