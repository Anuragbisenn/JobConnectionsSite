class CSVViewer {
    constructor() {
        this.csvData = [];
        this.filteredData = [];
        this.headers = ['First Name', 'URL', 'Email Address', 'Company', 'Position'];
        this.currentRowIndex = 0;
        this.currentResultIndex = 0;
        this.isSearchActive = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadData();
    }

    initializeElements() {
        this.dataDisplay = document.getElementById('dataDisplay');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentRowSpan = document.getElementById('currentRow');
        this.totalRowsSpan = document.getElementById('totalRows');
        this.loading = document.getElementById('loading');
        this.noData = document.getElementById('noData');
        this.jumpInput = document.getElementById('jumpInput');
        this.jumpBtn = document.getElementById('jumpBtn');
        
        // Search elements
        this.companySearch = document.getElementById('companySearch');
        this.searchBtn = document.getElementById('searchBtn');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');
        this.searchResults = document.getElementById('searchResults');
        this.resultsCount = document.getElementById('resultsCount');
        this.currentResult = document.getElementById('currentResult');
        this.totalResults = document.getElementById('totalResults');
        this.prevResultBtn = document.getElementById('prevResultBtn');
        this.nextResultBtn = document.getElementById('nextResultBtn');
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousRow());
        this.nextBtn.addEventListener('click', () => this.nextRow());
        this.jumpBtn.addEventListener('click', () => this.jumpToRecord());
        
        // Enter key on jump input
        this.jumpInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.jumpToRecord();
            }
        });
        
        // Search event listeners
        this.searchBtn.addEventListener('click', () => this.searchByCompany());
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        this.prevResultBtn.addEventListener('click', () => this.previousResult());
        this.nextResultBtn.addEventListener('click', () => this.nextResult());
        
        // Enter key on search input
        this.companySearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchByCompany();
            }
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        
        this.dataDisplay.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.dataDisplay.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            let endX = e.changedTouches[0].clientX;
            let endY = e.changedTouches[0].clientY;
            
            let diffX = startX - endX;
            let diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextRow(); // Swipe left = next
                } else {
                    this.previousRow(); // Swipe right = previous
                }
            }
            
            startX = 0;
            startY = 0;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.previousRow();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.nextRow();
            }
        });
    }

    loadData() {
        // Data is now loaded via script tag in HTML
        if (typeof csvData !== 'undefined' && csvData.length > 0) {
            this.csvData = csvData;
            console.log('Data loaded successfully:', this.csvData.length, 'records');
            this.jumpInput.max = this.csvData.length;
            this.displayCurrentRow();
            this.updateNavigation();
            this.loading.style.display = 'none';
        } else {
            console.error('csvData not found or empty');
            this.loading.innerHTML = 'Error: Data not loaded. Please ensure data.js is included.';
        }
    }

    jumpToRecord() {
        const recordNumber = parseInt(this.jumpInput.value);
        
        if (isNaN(recordNumber) || recordNumber < 1 || recordNumber > this.csvData.length) {
            alert(`Please enter a valid record number between 1 and ${this.csvData.length}`);
            return;
        }
        
        // Convert to 0-based index
        this.currentRowIndex = recordNumber - 1;
        this.displayCurrentRow();
        this.updateNavigation();
        
        // Clear the input
        this.jumpInput.value = '';
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
            this.noData.style.display = 'block';
            this.loading.style.display = 'none';
            return;
        }

        // Parse headers (first row)
        this.headers = this.parseCSVLine(lines[0]);
        console.log('Headers:', this.headers);
        
        // Parse data rows
        this.csvData = [];
        for (let i = 1; i < lines.length; i++) {
            const columns = this.parseCSVLine(lines[i]);
            if (columns.length > 0 && columns.some(col => col.trim() !== '')) {
                this.csvData.push(columns);
            }
        }

        console.log('Total rows loaded:', this.csvData.length);
        console.log('Sample row:', this.csvData[0]);

        if (this.csvData.length === 0) {
            this.noData.style.display = 'block';
            this.loading.style.display = 'none';
        }
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
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

    displayCurrentRow() {
        const dataToUse = this.isSearchActive ? this.filteredData : this.csvData;
        
        if (dataToUse.length === 0) {
            this.noData.style.display = 'block';
            this.dataDisplay.style.display = 'none';
            return;
        }

        this.noData.style.display = 'none';
        this.dataDisplay.style.display = 'block';

        const currentIndex = this.isSearchActive ? this.currentResultIndex : this.currentRowIndex;
        const currentRow = dataToUse[currentIndex];
        
        let html = '<div class="row-data">';
        
        for (let i = 0; i < this.headers.length; i++) {
            const header = this.headers[i];
            const value = currentRow[i] || '';
            
            html += `
                <div class="data-item">
                    <div class="data-label">${this.escapeHtml(header)}</div>
                    <div class="data-value">
                        ${this.formatValue(header, value)}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        this.dataDisplay.innerHTML = html;
    }

    formatValue(header, value) {
        // Check if this is a URL column and value looks like a URL
        if (header.toLowerCase().includes('url') && value && value.startsWith('http')) {
            return `<a href="${value}" target="_blank" class="url-link">${this.escapeHtml(value)}</a>`;
        }
        
        // Check if this is an email column and value contains an email
        if (header.toLowerCase().includes('email') && value && value.includes('@')) {
            return `
                <div class="email-container">
                    <span class="email-text">${this.escapeHtml(value)}</span>
                    <button class="copy-email-btn" onclick="copyToClipboard('${value}')" title="Copy email">
                        📧 Copy
                    </button>
                </div>
            `;
        }
        
        // If value is empty, show "None"
        if (!value || value.trim() === '') {
            return '<span class="empty-value">None</span>';
        }
        
        return this.escapeHtml(value);
    }

    previousRow() {
        if (this.currentRowIndex > 0) {
            this.currentRowIndex--;
            this.displayCurrentRow();
            this.updateNavigation();
        }
    }

    nextRow() {
        if (this.currentRowIndex < this.csvData.length - 1) {
            this.currentRowIndex++;
            this.displayCurrentRow();
            this.updateNavigation();
        }
    }

    updateNavigation() {
        const dataToUse = this.isSearchActive ? this.filteredData : this.csvData;
        const currentIndex = this.isSearchActive ? this.currentResultIndex : this.currentRowIndex;
        
        // Update row counter
        this.currentRowSpan.textContent = currentIndex + 1;
        this.totalRowsSpan.textContent = dataToUse.length;
        
        // Update button states
        this.prevBtn.disabled = currentIndex === 0;
        this.nextBtn.disabled = currentIndex === dataToUse.length - 1;
        
        // Update button styles
        this.prevBtn.classList.toggle('disabled', this.prevBtn.disabled);
        this.nextBtn.classList.toggle('disabled', this.nextBtn.disabled);
    }

    // Search functionality
    searchByCompany() {
        const searchTerm = this.companySearch.value.trim().toLowerCase();
        
        if (!searchTerm) {
            alert('Please enter a company name to search');
            return;
        }
        
        // Find company column index
        const companyColumnIndex = this.headers.findIndex(header => 
            header.toLowerCase().includes('company')
        );
        
        if (companyColumnIndex === -1) {
            alert('Company column not found in data');
            return;
        }
        
        // Filter data by company name
        this.filteredData = this.csvData.filter(row => {
            const companyName = (row[companyColumnIndex] || '').toLowerCase();
            return companyName.includes(searchTerm);
        });
        
        if (this.filteredData.length === 0) {
            alert(`No employees found for company: "${this.companySearch.value}"`);
            return;
        }
        
        // Activate search mode
        this.isSearchActive = true;
        this.currentResultIndex = 0;
        
        // Update UI
        this.searchResults.style.display = 'block';
        this.clearSearchBtn.style.display = 'inline-block';
        this.resultsCount.textContent = this.filteredData.length;
        this.totalResults.textContent = this.filteredData.length;
        
        this.displayCurrentRow();
        this.updateNavigation();
        this.updateSearchNavigation();
    }
    
    clearSearch() {
        this.isSearchActive = false;
        this.filteredData = [];
        this.currentResultIndex = 0;
        
        // Reset UI
        this.searchResults.style.display = 'none';
        this.clearSearchBtn.style.display = 'none';
        this.companySearch.value = '';
        
        this.displayCurrentRow();
        this.updateNavigation();
    }
    
    previousResult() {
        if (this.isSearchActive && this.currentResultIndex > 0) {
            this.currentResultIndex--;
            this.displayCurrentRow();
            this.updateNavigation();
            this.updateSearchNavigation();
        }
    }
    
    nextResult() {
        if (this.isSearchActive && this.currentResultIndex < this.filteredData.length - 1) {
            this.currentResultIndex++;
            this.displayCurrentRow();
            this.updateNavigation();
            this.updateSearchNavigation();
        }
    }
    
    updateSearchNavigation() {
        if (!this.isSearchActive) return;
        
        this.currentResult.textContent = this.currentResultIndex + 1;
        this.prevResultBtn.disabled = this.currentResultIndex === 0;
        this.nextResultBtn.disabled = this.currentResultIndex === this.filteredData.length - 1;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global function for copying email to clipboard
function copyToClipboard(email) {
    navigator.clipboard.writeText(email).then(() => {
        // Show success feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#e74c3c';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#e74c3c';
        }, 2000);
    });
}

// Page Navigation Functions
function showMainApp() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Initialize CSV viewer only when entering main app
    if (!window.csvViewerInstance) {
        window.csvViewerInstance = new CSVViewer();
    }
}

function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation event listeners
    const exploreBtn = document.getElementById('exploreBtn');
    const backToLandingBtn = document.getElementById('backToLanding');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', showMainApp);
    }
    
    if (backToLandingBtn) {
        backToLandingBtn.addEventListener('click', showLandingPage);
    }
    
    // Show landing page by default
    showLandingPage();
});
