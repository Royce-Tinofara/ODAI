# 🚀 Quick Start Guide

## Windows Setup (Recommended)

### Step 1: Navigate to Project
```powershell
cd "C:\Users\royce\Desktop\New folder"
```

### Step 2: Start Backend (Terminal 1)
```powershell
npm run dev
```
You should see:
```
🚀 Server running on http://localhost:5000
```

### Step 3: Start Frontend (Terminal 2)
Open a new terminal/PowerShell window
```powershell
cd "C:\Users\royce\Desktop\New folder\client"
npm start
```

This will automatically open `http://localhost:3000` in your browser.

---

## 🎯 Using the Application

### 1. Webcam Detection
- ✅ Allow camera permissions when prompted
- Click **📹 Start Detection**
- Watch real-time object detection
- Objects will appear with bounding boxes
- Confidence scores shown for each detection

### 2. Image Upload
- Click **📤 Choose Image**
- Select any image from your computer
- AI processes and shows detected objects
- Click **💾 Download Result** to save annotated image

### 3. View History
- Click **📊 History** tab
- See all past detections
- Information auto-refreshes every 5 seconds

---

## 🐛 Troubleshooting

### "Cannot find module" error
```powershell
# Clean install
rm -r node_modules
npm install
```

### Port 3000 or 5000 already in use
Kill the process or change ports in `.env`

### Camera not working
- Allow browser permissions
- Check camera in Settings → Privacy
- Try different browser (Chrome recommended)

### Model not loading
- Check internet connection
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page

### Slow performance
- Close other applications
- Reduce image resolution
- Use webcam at lower resolution

---

## 📝 Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
```

---

## ✨ Key Features

| Feature | How to Use |
|---------|-----------|
| Real-time Webcam | Click Start Detection button |
| Image Upload | Click Choose Image button |
| Download Results | Click Download Result button |
| View History | Switch to History tab |
| Object Labels | Green text on each detection |
| Confidence Score | Percentage shown in tooltip |

---

## 🎓 First Time Tips

1. **Start with Image Upload** - Easier to test
2. **Use Clear Images** - Better detection accuracy
3. **Check Console** - Press F12 to debug
4. **Monitor Performance** - Check DevTools Performance tab
5. **Read Console Logs** - Useful error messages

---

## 🔄 Workflow

```
User Opens App
    ↓
AI Model Loads (~3-5 seconds)
    ↓
Choose Detection Method
    ↓
Upload Image / Start Camera
    ↓
AI Processes Input
    ↓
Show Results with Annotations
    ↓
Save/View Results
```

---

## 📱 Mobile Support

✓ Supports mobile browsers
✓ Image upload on mobile
⚠️ Camera access may vary by device
⚠️ Performance may be slower

---

## 🎨 Theme Colors

- **Primary**: Purple (#667eea)
- **Secondary**: Dark Purple (#764ba2)  
- **Success**: Green (#00ff00)
- **Background**: Gradient

---

## 📞 Need Help?

1. Check README.md for detailed docs
2. Check browser console (F12)
3. Verify Node.js installation: `node -v`
4. Verify npm installation: `npm -v`

---

## 🎉 Success Indicators

✓ Backend starts: "Server running on http://localhost:5000"
✓ Frontend starts: Opens browser automatically  
✓ Model loading: "Loading AI Model..." appears
✓ Model loaded: "✓ AI Model loaded successfully" in console

Once you see all these, you're ready to go! 🎊
