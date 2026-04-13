# 📱 Mobile Access Guide

Your app now runs on a local network, but **mobile browsers require HTTPS for camera access**. Here are your solutions:

---

## Solution 1: Use HTTPS with ngrok (Recommended) ⭐

### Easy Setup (5 minutes)

1. **Download ngrok** - https://ngrok.com/download
2. **Extract and run**:
```powershell
# Navigate to ngrok folder
cd path\to\ngrok

# Create HTTPS tunnel to your backend
.\ngrok http 5000

# Create HTTPS tunnel to your frontend  
.\ngrok http 3000
```

3. **You'll see URLs like:**
```
Frontend:  https://xyz123.ngrok-free.app
Backend:   https://abc456.ngrok-free.app
```

4. **Update your frontend proxy** - Edit `client/package.json`:
```json
"proxy": "https://abc456.ngrok-free.app"
```

5. **Restart frontend:**
```powershell
cd client
npm start
```

6. **On your phone:**
   - Go to: `https://xyz123.ngrok-free.app`
   - Camera permission prompt will appear! ✅
   - You can now use webcam detection

---

## Solution 2: Desktop Access (Easiest Now) ✅

**Use your desktop/laptop instead** - Camera access works perfectly on HTTP on desktop:
- Desktop: http://192.168.100.154:3000
- No HTTPS needed
- Full camera access

---

## Solution 3: Localhost Access (Advanced)

If phone is on **same private WiFi network**:

```powershell
# Check your phone's IP address
ipconfig

# Add phone's IP to Windows firewall
# Then access: http://<phone-ip>:3000 from phone
```

⚠️ Some mobile browsers may still restrict HTTP camera access.

---

## Solution 4: PWA HTTP Exception (iOS/Android)

For development, you can bypass HTTPS on some browsers:

**Android Chrome:**
- Go to Settings → Privacy
- Allow camera access for the domain

**iOS Safari:**
- Settings → Safari → Camera
- Allow for the domain

⚠️ This may not work reliably on all devices/browsers.

---

## Recommended Setup

**For best mobile webcam detection:**

1. Use ngrok (easiest, most reliable)
2. Creates HTTPS tunnel automatically
3. Mobile camera will prompt for permission
4. Share ngrok URL with others

**Commands:**
```powershell
# Terminal 1 - Frontend (auto-starts on :3000)
cd client
npm start

# Terminal 2 - Backend (auto-starts on :5000)  
npm run dev

# Terminal 3 - ngrok tunnel (creates HTTPS)
ngrok http 3000
```

Then on phone: `https://your-ngrok-url.app` ✅

---

## Testing Checklist

- [ ] App loads on phone
- [ ] Camera permission prompt appears
- [ ] Click "Allow"
- [ ] Webcam feed displays
- [ ] Start Detection button works
- [ ] Objects detected in real-time
- [ ] Download results works

---

## Troubleshooting

### "Still no camera permission prompt"
- Ensure you're on **HTTPS** (not HTTP)
- Check ngrok is running in separate terminal
- Try different mobile browser (Chrome recommended)

### "Camera works but API calls fail"
- Update proxy in `client/package.json` to ngrok backend URL
- Restart frontend after changing proxy
- Check ngrok is routing to correct port

### "ngrok URL expires"
- Free ngrok URLs expire after 2 hours of inactivity
- Restart ngrok to get new URL
- Upgrade ngrok for persistent URLs

---

## Architecture with ngrok

```
Phone Browser
     ↓
https://xyz123.ngrok.app (Frontend)
     ↓
https://abc456.ngrok.app (Backend API)
     ↓
Your Computer (192.168.100.154)
```

---

## Quick Start with ngrok (Copy-Paste)

1. **Download ngrok** - https://ngrok.com/download

2. **Extract and start:**
```powershell
cd Downloads\ngrok
.\ngrok http 3000
```

3. **Keep that terminal open, copy the HTTPS URL**

4. **On your phone browser:**
   - Paste the HTTPS URL from ngrok
   - Allow camera permission
   - Enjoy! 🎉

---

## Why This Works

- ✅ ngrok creates secure HTTPS tunnel
- ✅ Mobile browsers require HTTPS for camera
- ✅ Your computer is server
- ✅ Phone is client
- ✅ All communication encrypted

---

## Advanced: Self-Signed Certificate (Optional)

For permanent HTTPS without ngrok:
- Generate self-signed cert
- Configure Express.js for HTTPS
- Accept certificate warning on mobile
- Time-consuming but works

---

**Try ngrok first - it's the quickest solution!** 🚀
