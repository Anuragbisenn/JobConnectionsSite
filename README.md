# LinkedIn Connections Viewer

A mobile-optimized web application to browse through your LinkedIn connections one by one.

## Features

- **Mobile-First Design**: Optimized for smartphones and tablets
- **Row-by-Row Navigation**: Browse connections one at a time
- **Touch/Swipe Support**: Swipe left/right to navigate on mobile
- **Clickable LinkedIn URLs**: Direct links to LinkedIn profiles
- **GitHub Pages Ready**: Works directly on GitHub Pages without server

## Files Structure

```
LinkedinWeb/
├── index.html          # Main HTML file
├── styles.css          # Mobile-optimized CSS styling
├── script.js           # JavaScript with embedded data
└── README.md           # This file
```

## Navigation

- **Next/Previous Buttons**: Click to navigate between connections
- **Swipe Gestures**: Swipe left for next, right for previous (mobile)
- **Keyboard**: Arrow keys for navigation (desktop)
- **Row Counter**: Shows current position (e.g., "5 of 19")

## Deployment on GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `linkedin-connections`)
5. Make sure it's set to **Public**
6. Check "Add a README file"
7. Click "Create repository"

### Step 2: Upload Files

1. In your new repository, click "uploading an existing file"
2. Upload all files from the `LinkedinWeb` folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `FinalConnections.csv`
   - `README.md`
3. Write a commit message like "Initial upload of LinkedIn connections website"
4. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. In your repository, go to **Settings** tab
2. Scroll down to **Pages** section in the left sidebar
3. Under "Source", select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

### Step 4: Access Your Website

1. GitHub will provide a URL like: `https://yourusername.github.io/linkedin-connections`
2. It may take a few minutes to become available
3. Your website will be live and accessible to anyone with the URL

## Local Development

To run locally:

1. Open the `LinkedinWeb` folder in your file explorer
2. Double-click `index.html` to open in your browser
3. Or use a local server (recommended for better CSV loading):
   ```bash
   # If you have Python installed
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
/* Change the gradient background */
background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
```

### Adding More Filters
Modify the `setFilter()` function in `script.js` to add custom filtering logic.

### Styling Cards
Update the `.connection-card` class in `styles.css` to change card appearance.

## Privacy Note

⚠️ **Important**: This website will be publicly accessible on GitHub Pages. Make sure you're comfortable sharing your connections data publicly, or consider:

1. Removing sensitive email addresses from the CSV
2. Using a private repository (requires GitHub Pro for Pages)
3. Deploying to a private hosting service instead

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Troubleshooting

**CSV not loading?**
- Ensure `FinalConnections.csv` is in the same folder as `index.html`
- Check browser console for errors (F12 → Console tab)

**Styling issues?**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Ensure all files are uploaded correctly

**GitHub Pages not working?**
- Wait 5-10 minutes after enabling Pages
- Check that repository is public
- Verify all files are in the root directory

## Support

If you encounter any issues, check:
1. Browser console for JavaScript errors
2. Network tab to see if CSV is loading
3. Ensure all files are in the correct locations
