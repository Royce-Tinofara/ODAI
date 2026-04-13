# Troubleshooting Guide

## Common Issues & Solutions

---

## 1. Webcam Issues

### Problem: "Permission denied" for camera

**Solution:**
- Check browser camera permissions
- Windows 10/11: Settings → Privacy → Camera → Allow
- Restart browser
- Try incognito mode
- Use HTTPS (required in some browsers)

### Problem: Webcam is black/frozen

**Solution:**
- Refresh the page
- Close and reopen browser
- Check if another app is using camera
- Restart computer
- Try a different browser

### Problem: "getUserMedia is not available"

**Solution:**
- Update browser to latest version
- Use Chrome, Edge, or Firefox (best support)
- Ensure using HTTPS (not HTTP)
- Check console for errors

---

## 2. Installation Issues

### Problem: "npm ERR! code ENOENT"

**Solution:**
```powershell
# Ensure you're in correct directory
cd "C:\Users\royce\Desktop\New folder"

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Problem: Slow npm install

**Solution:**
```powershell
# Use npm ci instead (faster, more reliable)
npm ci

# Or increase timeout
npm install --legacy-peer-deps

# Or set registry to faster mirror
npm config set registry https://registry.npmmirror.com
```

### Problem: "Module not found" after npm install

**Solution:**
```powershell
# Fresh install
rm -r node_modules
rm package-lock.json
npm install
```

---

## 3. Port Issues

### Problem: "Port 5000 is already in use"

**Solution (PowerShell):**
```powershell
# Find process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill it
Stop-Process -Id <PID> -Force

# Or use different port
$env:PORT=5001
npm run dev
```

### Problem: "Port 3000 is already in use"

**Solution:**
```powershell
# In client directory
$env:DANGEROUSLY_DISABLE_HOST_CHECK=true npm start

# Or use different port
$env:PORT=3001 npm start
```

---

## 4. AI Model Loading

### Problem: "Model loading stuck" or "Taking too long"

**Solution:**
- Check internet connection
- Wait 5-10 minutes (first load is large)
- Clear browser cache
- Try different browser
- Check console for errors

### Problem: "Failed to load model"

**Solution:**
```javascript
// Check network tab in DevTools
// Ensure CDN access:
// - https://cdn.jsdelivr.net
// - https://tfhub.dev

// Clear cache and retry
// In browser console:
// location.reload();
```

### Problem: "Model predictions are inaccurate"

**Solution:**
- Use clear, well-lit images
- Ensure objects are clearly visible
- Try different angles/perspectives
- Check object is on COCO-SSD list
- Average confidence may be lower for transparent objects

---

## 5. Performance Issues

### Problem: Webcam detection is slow/laggy

**Solution:**
- Close other browser tabs
- Reduce webcam resolution
- Lower detection frequency
- Use GPU acceleration
- Check CPU/RAM usage
- Disable browser extensions

### Problem: High memory usage

**Solution:**
```powershell
# Increase Node memory
node --max-old-space-size=4096 server.js

# Or limit iframe count
# Check DevTools → Memory tab
```

### Problem: Janky/stuttering detection

**Solution:**
- Reduce canvas size
- Use requestAnimationFrame
- Optimize draw calls
- Profile in DevTools Performance tab

---

## 6. API/Backend Issues

### Problem: "Failed to fetch" or "CORS error"

**Solution (Console shows CORS error):**
- Backend CORS is already configured
- Check backend is running on port 5000
- Verify URL in frontend: should be `/api/...`
- Check DevTools → Network tab

### Problem: Image upload returns 400 error

**Solution:**
- Ensure file is image format (.jpg, .png, etc.)
- Check file size < 10MB
- Verify FormData format
- Check DevTools → Network → Response

### Problem: "Cannot GET /api/..." (404 error)

**Solution:**
- Check endpoint name in server.js
- Verify backend is running
- Check correct HTTP method (GET, POST, etc.)
- Look for typos in URL

---

## 7. Browser Issues

### Problem: Chrome shows blank page

**Solution:**
- Clear cache: Ctrl+Shift+Delete
- Disable extensions
- Try incognito mode
- Update Chrome to latest
- Try different browser

### Problem: "Cannot connect to localhost:3000"

**Solution:**
```powershell
# Check if frontend server is running
# Should see messages in terminal

# Restart frontend
cd client
npm start

# Verify on correct port
# Open http://localhost:3000 (not http://localhost:5000)
```

### Problem: Page loads but nothing displays

**Solution:**
- Press F12 to open DevTools
- Check Console tab for errors
- Check Network tab for failed requests
- Clear cache and refresh
- Try different browser

---

## 8. File Upload Issues

### Problem: "No image provided" error

**Solution:**
- Select file before clicking upload
- File must be image (.jpg, .png, .gif, .webp)
- File size must be < 10MB
- Try different image file

### Problem: Upload takes very long

**Solution:**
- Check file size (should be < 5MB)
- Check internet connection
- Check backend console for errors
- Large file → compress/resize first

---

## 9. History Not Showing

### Problem: History tab is empty

**Solution:**
- Perform at least one detection first
- Check Console for API errors
- Verify backend is running
- Check Network tab for /api/history call

### Problem: History not updating

**Solution:**
- Check auto-refresh is on (every 5 seconds)
- Manually click Refresh button
- Check DevTools Network tab
- Verify backend is saving data

---

## 10. Git Issues

### Problem: "fatal: not a git repository"

**Solution:**
```powershell
cd "C:\Users\royce\Desktop\New folder"
git init
git add .
git commit -m "Initial commit"
```

### Problem: ".env file being committed"

**Solution:**
```powershell
# Remove from git
git rm --cached .env

# Ensure .gitignore has .env
# Then commit
git add .
git commit -m "Remove .env"
```

---

## 11. Node/npm Version Issues

### Problem: "Node version too old"

**Solution:**
```powershell
# Check version
node -v
npm -v

# Upgrade Node from nodejs.org
# Or use nvm (Node Version Manager)
```

### Problem: "npm ERR! ERR! code ERESOLVE"

**Solution:**
```powershell
npm install --legacy-peer-deps

# Or delete package-lock.json and reinstall
rm package-lock.json
npm install
```

---

## 12. Terminal/PowerShell Issues

### Problem: "npm: The term 'npm' is not recognized"

**Solution:**
- Restart terminal/PowerShell
- Check Node.js is installed: `where node`
- Reinstall Node.js
- Add to PATH if needed

### Problem: Commands not working in PowerShell

**Solution:**
```powershell
# Use escape for spaces in paths
cd "C:\Users\royce\Desktop\New folder"

# Or use cd with path quotes
cd 'C:\Users\royce\Desktop\New folder\'

# Try Command Prompt (cmd) instead
```

---

## 13. macOS-Specific Issues

### Problem: Command not found (Node/npm)

**Solution:**
```bash
# Install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node
brew install node
```

---

## 14. Linux-Specific Issues

### Problem: Permission denied

**Solution:**
```bash
# Use sudo
sudo npm install

# Or fix permissions
sudo chown -R $(whoami) ~/.npm
```

---

## Debug Checklist

Before reporting issue, check:

- [ ] Backend running? (Terminal shows port 5000 message)
- [ ] Frontend running? (Browser shows app)
- [ ] Webcam permissions granted?
- [ ] Model loaded? (No loading spinner)
- [ ] Internet connection working?
- [ ] Correct browser (Chrome recommended)?
- [ ] DevTools Console showing errors? (Press F12)
- [ ] Network tab showing failed requests?

---

## Getting Help

1. **Check Console** - Press F12 → Console tab
2. **Check Network** - F12 → Network tab
3. **Copy error message** - Share in search engine
4. **Check logs** - Terminal output
5. **Restart everything** - Backend, frontend, browser

---

## Quick Fix Commands

```powershell
# Full cleanup and restart
rm -r node_modules
rm package-lock.json
npm install
npm run dev

# Frontend only
cd client
npm start
```

---

## Still Having Issues?

1. Check the README.md for detailed documentation
2. Review DEVELOPMENT.md for development info
3. Check API.md for API details
4. Look at source code comments
5. Try with different images/camera angles
6. Restart computer as last resort

Good luck! 🎉
