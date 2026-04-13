import React, { useRef, useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = ({ model, setDetections }) => {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionData, setDetectionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setSelectedImage(img);
          detectObjectsInImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const detectObjectsInImage = async (img) => {
    if (!model) return;

    setLoading(true);
    try {
      const predictions = await model.detect(img);
      setDetectionData(predictions);
      setDetections(predictions);

      // Draw on canvas
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        const score = prediction.score.toFixed(2);

        // Draw bounding box
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw label background
        ctx.fillStyle = '#00ff00';
        const labelText = `${prediction.class} (${score})`;
        const textMetrics = ctx.measureText(labelText);
        ctx.fillRect(x, y - 25, textMetrics.width + 10, 20);

        // Draw label text
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.fillText(labelText, x + 5, y - 8);
      });

      // Send to backend
      try {
        const formData = new FormData();
        formData.append('image', fileInputRef.current.files[0]);
        await axios.post('/api/detect', formData);
      } catch (error) {
        console.error('Error uploading to server:', error);
      }
    } catch (error) {
      console.error('Error detecting objects:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = 'detection-result.png';
    link.click();
  };

  return (
    <div className="image-uploader">
      <h2>📤 Image Upload Detection</h2>

      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          className="btn btn-upload"
          onClick={() => fileInputRef.current.click()}
        >
          <span>📁 Choose Image</span>
        </button>
        <p>or drag and drop an image here</p>
      </div>

      {loading && <div className="loading">Processing image...</div>}

      {selectedImage && (
        <div className="preview-container">
          <canvas ref={canvasRef} className="preview-canvas" />
        </div>
      )}

      {detectionData.length > 0 && (
        <div className="detection-results">
          <div className="results-header">
            <h3>Detected Objects:</h3>
            <button className="btn btn-download" onClick={downloadResult}>
              💾 Download Result
            </button>
          </div>

          <div className="results-grid">
            {detectionData.map((detection, idx) => (
              <div key={idx} className="result-card">
                <div className="card-header">
                  <span className="object-name">{detection.class}</span>
                  <span className="confidence-badge">
                    {(detection.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="card-details">
                  <p>
                    <strong>Confidence:</strong>{' '}
                    {(detection.score * 100).toFixed(2)}%
                  </p>
                  <p>
                    <strong>Position:</strong> x: {detection.bbox[0].toFixed(0)},
                    y: {detection.bbox[1].toFixed(0)}
                  </p>
                  <p>
                    <strong>Size:</strong> w: {detection.bbox[2].toFixed(0)}, h:{' '}
                    {detection.bbox[3].toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && detectionData.length === 0 && !loading && (
        <div className="no-results">
          <p>✓ Image processed - No objects detected</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
