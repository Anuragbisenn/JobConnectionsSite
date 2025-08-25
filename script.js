class CSVViewer {
    constructor() {
        this.csvData = [];
        this.headers = ['First Name', 'URL', 'Email Address', 'Company', 'Position'];
        this.currentRowIndex = 0;
        
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
        if (this.csvData.length === 0) {
            this.noData.style.display = 'block';
            this.dataDisplay.style.display = 'none';
            return;
        }

        this.noData.style.display = 'none';
        this.dataDisplay.style.display = 'block';

        const currentRow = this.csvData[this.currentRowIndex];
        
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
        // Update row counter
        this.currentRowSpan.textContent = this.currentRowIndex + 1;
        this.totalRowsSpan.textContent = this.csvData.length;
        
        // Update button states
        this.prevBtn.disabled = this.currentRowIndex === 0;
        this.nextBtn.disabled = this.currentRowIndex === this.csvData.length - 1;
        
        // Update button styles
        this.prevBtn.classList.toggle('disabled', this.prevBtn.disabled);
        this.nextBtn.classList.toggle('disabled', this.nextBtn.disabled);
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CSVViewer();
});
