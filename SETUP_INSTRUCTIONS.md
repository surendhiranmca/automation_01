# Setup and Installation Instructions

Complete guide to set up and run the Room Name List Automation System.

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** v14.0.0 or higher (download from https://nodejs.org/)
- **npm** v6.0.0 or higher (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- At least 50MB free disk space

### Verify Installation

Open Command Prompt (Windows) or Terminal (Mac/Linux) and run:
```bash
node --version
npm --version
```

You should see version numbers. If not, install Node.js.

---

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory

**Windows (Command Prompt):**
```bash
cd "C:\Users\suren\Dropbox\Dacuments\Study Metirials\Automation"
```

**Mac/Linux (Terminal):**
```bash
cd "/path/to/Automation"
```

### Step 2: Install Frontend & Backend Dependencies

**Frontend Dependencies:**
```bash
npm install
```

**Backend Server Dependencies:**
```bash
cd backend
npm install
cd ..
```

### Step 3: Set Up Database (Optional for MySQL, Zero-Config Fallback Available)

#### Mode A: Production MySQL Database
1. Ensure MySQL Server 8.0+ is running locally or on cloud.
2. Execute schema script:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```
3. Set environment variables (or `.env` file):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=hostel_automation
   PORT=5000
   ```

#### Mode B: Zero-Config In-Memory Fallback
- No configuration required! If MySQL is not connected, the server automatically initializes in-memory fallback storage with demo admin user (`admin` / `admin`).

### Step 4: Start Frontend and Backend Servers

**Option 1: Run Backend API Server (Port 5000)**
```bash
node backend/server.js
```

**Option 2: Run React Frontend Client (Port 3000)**
```bash
npm start
```

**Option 3: Run Both Concurrently**
```bash
npm run dev
```

The browser will automatically open at `http://localhost:3000` with API connected at `http://localhost:5000/api`.

---

## 🎯 Quick Start Guide

### First Time User
1. App opens to Dashboard page
2. You'll see sample data pre-populated:
   - 4 sample rooms (101, 102, 201, 202)
   - 18 sample people across rooms
   - Update countdown showing 15-day interval

### Load Custom Data
- Use the Rooms page to add your own rooms
- Use the Name List page to add people
- Data automatically saves to localStorage

### Export Your Data
1. Go to Settings page
2. Click "📥 Export"
3. Save the JSON file as backup
4. You can restore it anytime via Import

---

## 🔧 Configuration

### Change Sample Data Loading

**To disable auto-load of sample data:**

Edit `src/App.js` line 20-22:

```javascript
// Change from:
const loadSampleData = urlParams.get('demo') === 'true' || localStorage.getItem('rnl_demo_loaded') !== 'true';

// To:
const loadSampleData = urlParams.get('demo') === 'true';
```

**To force reload sample data:**
- Visit: `http://localhost:3000?demo=true`
- Or manually clear browser storage and refresh

### Customize Colors

Edit `src/index.css` (CSS variables section):

```css
:root {
  --primary: #2563eb;      /* Change this blue to your color */
  --secondary: #f59e0b;    /* Change this amber */
  --success: #10b981;      /* Change this green */
  --danger: #ef4444;       /* Change this red */
  --background: #f9fafb;   /* Change background */
  --text-dark: #1f2937;    /* Change text color */
}
```

### Change Update Interval

Currently set to 15 days. To change:

Edit `src/utils/listGenerator.js` line 20:

```javascript
// Current (15 days):
const newEndDate = addDays(today, 14);  // 14 days after start = 15 day period

// To change to 30 days:
const newEndDate = addDays(today, 29);  // 29 days after start = 30 day period
```

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
```

This creates a `build/` folder with optimized files ready for deployment.

**File size:** ~150KB (gzipped)

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"
**Solution:** Node.js not installed. Download from https://nodejs.org/ and install.

### Issue: "Port 3000 already in use"
**Solution:** Kill process using port 3000:
- Windows: `netstat -ano | findstr :3000`
- Mac/Linux: `lsof -i :3000`
- Or use different port: `PORT=3001 npm start`

### Issue: "Module not found" errors
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: Sample data not loading
**Solution:**
1. Clear browser localStorage (DevTools > Application > Storage > localStorage > Clear All)
2. Visit: `http://localhost:3000?demo=true`
3. Refresh page

### Issue: Data not persisting after refresh
**Solution:**
1. Check browser is not in Private/Incognito mode
2. Verify localStorage is enabled in browser settings
3. Check browser hasn't disabled localStorage for this site

### Issue: App runs very slowly
**Solution:**
1. Close other browser tabs
2. Clear browser cache
3. Restart development server
4. Update Node.js to latest version

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit https://vercel.com/
   - Click "New Project"
   - Select your GitHub repo
   - Click "Deploy"

### Deploy to Netlify

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Upload to Netlify**
   - Visit https://app.netlify.com/
   - Drag and drop `build/` folder
   - App is live!

### Deploy to Shared Hosting (cPanel/Plesk)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Upload files**
   - FTP to server
   - Upload all files from `build/` folder
   - Create `.htaccess` file (see below)

3. **Create `.htaccess` file in root:**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 📝 Available Scripts

In project directory, you can run:

### `npm start`
- Runs app in development mode
- Open http://localhost:3000 to view
- Page reloads on code changes
- Errors display in console

### `npm run build`
- Builds app for production
- Optimizes and minifies code
- Ready for deployment

### `npm test`
- Launches test runner (if tests added)

### `npm run eject`
- ⚠️ One-way operation! Exposes build configuration
- Only use if you need full control

---

## 📂 Project Files

```
Automation/
├── node_modules/          # Dependencies (don't edit)
├── public/
│   └── index.html        # HTML template
├── src/
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions
│   ├── App.js            # Main app component
│   ├── App.css           # App styles
│   ├── index.js          # Entry point
│   └── index.css         # Global styles
├── package.json          # Project config
├── README.md             # Documentation
└── TESTING.md            # Testing guide
```

---

## 🔐 Data & Privacy

- **All data stored locally** in browser's localStorage
- **No data sent to servers**
- **Completely offline** after initial load
- **Users have full control** over their data
- **Export/Import** available anytime

### Clear All Data

From Settings page:
- Click "🗑️ Clear All"
- Confirm in dialog
- All data immediately deleted
- App resets to initial state

---

## 📞 Support

### Getting Help

1. **Check README.md** for feature documentation
2. **Check TESTING.md** for testing procedures
3. **Check browser console** (F12) for error messages
4. **Check localStorage** in DevTools (Application > Storage)

### Common Questions

**Q: Can I use this on mobile?**
A: Yes! App is fully responsive and works on all devices.

**Q: Is there a backend version?**
A: Current version uses localStorage. Backend can be added by replacing storage layer.

**Q: Can multiple users share data?**
A: Current version single-user. Would require backend for multi-user support.

**Q: How do I backup my data?**
A: Use Settings > Export Data to download JSON backup.

**Q: Can I access data on different device?**
A: Export data, transfer file, then import on new device.

---

## ✅ Verification Checklist

After installation, verify:
- [ ] App opens at http://localhost:3000
- [ ] Dashboard displays sample data
- [ ] Sample rooms visible (101, 102, 201, 202)
- [ ] Sample people visible (18 people)
- [ ] All sidebar pages accessible
- [ ] Search functionality works
- [ ] Can add new room
- [ ] Can add new person
- [ ] Can export data
- [ ] Data persists on refresh

If all boxes checked, installation successful! ✅

---

## 🎉 You're Ready!

Your Room Name List Automation System is now ready to use.

Start with the Dashboard to see your current setup, or go to Rooms page to create your first room.

Enjoy! 🚀

---

## 📊 System Requirements Summary

| Requirement | Minimum | Recommended |
|-------------|---------|------------|
| Node.js | v14.0.0 | v18.0.0+ |
| npm | v6.0.0 | v8.0.0+ |
| RAM | 2GB | 4GB+ |
| Disk Space | 50MB | 200MB |
| Browser | ES6 Support | Chrome/Firefox Latest |
| Internet | Required (first install) | Not required after |

---

Version: 1.0.0
Last Updated: July 31, 2026
