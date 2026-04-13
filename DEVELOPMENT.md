# Development Guide

## Project Structure Explained

```
project-root/
├── server.js              # Backend Express server (entry point)
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── README.md             # Main documentation
├── QUICK_START.md        # Quick start guide
├── API.md                # API documentation
├── DEVELOPMENT.md        # This file
├── uploads/              # Uploaded images (dev)
│
└── client/               # Frontend React app
    ├── public/
    │   ├── index.html    # Main HTML file
    │   └── favicon.ico   # Browser icon
    ├── src/
    │   ├── index.js      # React entry point
    │   ├── App.js        # Main component
    │   ├── App.css       # Main styles
    │   ├── index.css     # Global styles
    │   └── components/
    │       ├── WebcamDetector.js      # Live detection
    │       ├── WebcamDetector.css
    │       ├── ImageUploader.js       # Upload detection
    │       ├── ImageUploader.css
    │       ├── DetectionHistory.js    # History view
    │       └── DetectionHistory.css
    ├── package.json      # Frontend dependencies
    └── node_modules/     # Frontend packages
```

---

## Backend Development

### Adding a New Endpoint

1. Open `server.js`
2. Add your route:
```javascript
app.get('/api/your-endpoint', (req, res) => {
  res.json({ message: 'Your response' });
});
```

### Using Environment Variables
```javascript
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;
```

### Adding Middleware
```javascript
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
```

---

## Frontend Development

### React Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import './Component.css';

const MyComponent = ({ props }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects here
  }, [dependencies]);

  return (
    <div className="component">
      {/* JSX here */}
    </div>
  );
};

export default MyComponent;
```

### Using TensorFlow.js
```javascript
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Load model
const model = await cocoSsd.load();

// Detect objects
const predictions = await model.detect(imageOrVideo);
// Returns: [{ bbox: [x, y, w, h], class: 'object', score: 0.95 }]
```

### Canvas Drawing for Detections
```javascript
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');

// Draw bounding boxes
predictions.forEach(prediction => {
  const [x, y, width, height] = prediction.bbox;
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
});
```

---

## Common Tasks

### Adding a New Feature

1. **Create Component**
```bash
touch client/src/components/NewFeature.js
touch client/src/components/NewFeature.css
```

2. **Import in App.js**
```jsx
import NewFeature from './components/NewFeature';
```

3. **Add to JSX**
```jsx
<NewFeature />
```

### Styling Components

Use CSS Modules or regular CSS files:
```css
.component-name {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
```

### API Integration

```javascript
import axios from 'axios';

// GET request
const data = await axios.get('/api/endpoint');

// POST request
const response = await axios.post('/api/endpoint', {
  key: 'value'
});

// File upload
const formData = new FormData();
formData.append('image', file);
await axios.post('/api/detect', formData);
```

---

## Debugging

### Browser DevTools (F12)

1. **Console Tab** - View logs and errors
```javascript
console.log('Debug message');
console.error('Error happened');
```

2. **Network Tab** - Monitor API calls
- Check request/response headers
- View response data

3. **Performance Tab** - Monitor performance
- Check FPS (target: 30+)
- Monitor memory usage

### Server Logging

Add to server.js:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### React DevTools Browser Extension

Install from Chrome Web Store to debug React components.

---

## Performance Optimization

### Frontend

1. **Memoization** - Prevent unnecessary re-renders
```javascript
const MemoComponent = React.memo(Component);
```

2. **useCallback** - Cache functions
```javascript
const handleClick = useCallback(() => {
  // handler code
}, [dependencies]);
```

3. **useMemo** - Cache computed values
```javascript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
```

### Backend

1. **Caching** - Cache model after loading
```javascript
let model = null;
async function getModel() {
  if (!model) {
    model = await cocoSsd.load();
  }
  return model;
}
```

2. **Compression** - Enable gzip
```javascript
import compression from 'compression';
app.use(compression());
```

---

## Testing

### Unit Testing

Create test files: `Component.test.js`

```javascript
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText(/text/i)).toBeInTheDocument();
});
```

Run tests:
```bash
npm test
```

---

## Deployment Preparation

### 1. Build Frontend
```bash
cd client
npm run build
```
Creates optimized build in `client/build/`

### 2. Serve Static Files
```javascript
app.use(express.static(path.join(__dirname, 'client/build')));
```

### 3. Environment Variables
Set production environment:
```
PORT=80
NODE_ENV=production
```

### 4. Deployment Options
- Heroku
- Vercel (frontend only)
- AWS
- DigitalOcean
- Azure

---

## Useful Commands

```bash
# Backend
npm install              # Install dependencies
npm run dev             # Start with nodemon (hot reload)
npm start               # Start server
npm audit               # Check vulnerabilities

# Frontend
cd client && npm start  # Start dev server
npm run build           # Build for production
npm test                # Run tests

# Git
git init                # Initialize git
git add .               # Stage all files
git commit -m "msg"     # Make commit
git push                # Push to remote
```

---

## Best Practices

### Code Style
- Use consistent naming (camelCase for variables/functions)
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### Security
- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Never commit `.env` to git
- Implement CORS properly

### Performance
- Lazy load components
- Optimize images
- Cache API responses
- Minimize bundle size
- Use CDN for static files

---

## Resources

- [React Docs](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [TensorFlow.js API](https://js.tensorflow.org/api/latest/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

---

## Troubleshooting Development

### Module not found
```bash
# Clean install
rm -rf node_modules
npm install
```

### Port already in use
```powershell
# Find process on port
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill it
Stop-Process -Id <PID> -Force
```

### Memory issues
```bash
# Increase Node memory
node --max-old-space-size=4096 server.js
```

---

Happy coding! 🎉
