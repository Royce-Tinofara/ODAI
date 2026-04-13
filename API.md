# API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints

### 1. Health Check
**GET** `/health`

Check if server is running.

**Response:**
```json
{
  "status": "Server is running"
}
```

**Example:**
```bash
curl http://localhost:5000/api/health
```

---

### 2. Upload Image for Detection
**POST** `/detect`

Upload an image to be processed by the AI model.

**Headers:**
```
Content-Type: multipart/form-data
```

**Parameters:**
- `image` (file, required) - Image file to detect objects in

**Response:**
```json
{
  "success": true,
  "detectionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Image uploaded successfully. Ready for AI processing."
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/detect \
  -F "image=@/path/to/image.jpg"
```

---

### 3. Get All Detection History
**GET** `/history`

Retrieve all past detections.

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "image123.jpg",
    "originalName": "my-computer.jpg",
    "timestamp": "2024-04-13T10:30:00.000Z",
    "objects": [
      {
        "class": "keyboard",
        "score": 0.95,
        "bbox": [10, 20, 150, 100]
      }
    ],
    "confidence": 0.95
  }
]
```

**Example:**
```bash
curl http://localhost:5000/api/history
```

---

### 4. Get Specific Detection
**GET** `/detection/:id`

Retrieve details of a specific detection by ID.

**Parameters:**
- `id` (string, required) - Detection ID

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "image123.jpg",
  "originalName": "my-computer.jpg",
  "timestamp": "2024-04-13T10:30:00.000Z",
  "objects": [
    {
      "class": "keyboard",
      "score": 0.95,
      "bbox": [10, 20, 150, 100]
    }
  ],
  "confidence": 0.95
}
```

**Example:**
```bash
curl http://localhost:5000/api/detection/550e8400-e29b-41d4-a716-446655440000
```

---

### 5. Update Detection Results
**POST** `/detection/:id/results`

Update detection results with AI model predictions.

**Headers:**
```
Content-Type: application/json
```

**Parameters:**
- `id` (string, required) - Detection ID
- `objects` (array) - Detected objects
- `confidence` (number) - Overall confidence score

**Body:**
```json
{
  "objects": [
    {
      "class": "keyboard",
      "score": 0.95,
      "bbox": [10, 20, 150, 100]
    },
    {
      "class": "monitor",
      "score": 0.92,
      "bbox": [200, 50, 300, 250]
    }
  ],
  "confidence": 0.93
}
```

**Response:**
```json
{
  "success": true,
  "detection": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "image123.jpg",
    "originalName": "my-computer.jpg",
    "timestamp": "2024-04-13T10:30:00.000Z",
    "objects": [
      {
        "class": "keyboard",
        "score": 0.95,
        "bbox": [10, 20, 150, 100]
      }
    ],
    "confidence": 0.93
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/detection/550e8400-e29b-41d4-a716-446655440000/results \
  -H "Content-Type: application/json" \
  -d '{
    "objects": [{"class": "keyboard", "score": 0.95, "bbox": [10, 20, 150, 100]}],
    "confidence": 0.95
  }'
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "No image provided"
}
```

### 404 - Not Found
```json
{
  "error": "Detection not found"
}
```

### 500 - Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Data Models

### Detection Object
```json
{
  "id": "UUID",
  "filename": "string",
  "originalName": "string",
  "timestamp": "ISO 8601 date",
  "objects": [
    {
      "class": "string",
      "score": "number 0-1",
      "bbox": [x, y, width, height]
    }
  ],
  "confidence": "number 0-1"
}
```

---

## Rate Limiting
No rate limiting currently implemented. Consider adding in production.

## Authentication
No authentication currently implemented. Consider adding for production.

## CORS
CORS is enabled for all origins. Restrict in production:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Example Usage Flow

### 1. Upload an image
```bash
curl -X POST http://localhost:5000/api/detect \
  -F "image=@photo.jpg"
```
Response: `detectionId: "abc-123"`

### 2. Get detection history
```bash
curl http://localhost:5000/api/history
```

### 3. Get specific detection
```bash
curl http://localhost:5000/api/detection/abc-123
```

### 4. Update with AI results
```bash
curl -X POST http://localhost:5000/api/detection/abc-123/results \
  -H "Content-Type: application/json" \
  -d '{"objects": [...], "confidence": 0.95}'
```

---

## Frontend Integration

The frontend automatically:
1. Uploads images to `/api/detect`
2. Fetches history from `/api/history`
3. Updates results via `/api/detection/:id/results`

No additional setup needed!

---

## Testing with Postman

1. Open Postman
2. Create new request
3. Set method: POST
4. URL: `http://localhost:5000/api/detect`
5. Body → form-data
6. Key: `image`, Value: Select image file
7. Send

---

## Production Considerations

- ✓ Add authentication
- ✓ Implement rate limiting
- ✓ Use database instead of arrays
- ✓ Add proper logging
- ✓ Implement HTTPS
- ✓ Add input validation
- ✓ Set up error monitoring
- ✓ Cache model file
- ✓ Implement pagination for history
