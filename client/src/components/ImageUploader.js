import React, { useRef, useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = ({ model, setDetections, confidenceThreshold = 0.5, modelType = 'coco-ssd' }) => {
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
      let predictions = [];

      if (modelType === 'coco-ssd') {
        predictions = await model.detect(img);
        // Filter by confidence threshold
        predictions = predictions.filter(pred => pred.score >= confidenceThreshold);
      } else if (modelType === 'mobilenet') {
        // MobileNet uses classify method for image classification
        const results = await model.classify(img);
        // Convert classification results to detection format
        predictions = results
          .filter(result => result.probability >= confidenceThreshold)
          .slice(0, 5) // Top 5 results
          .map((result, index) => ({
            class: result.className,
            score: result.probability,
            bbox: [10 + index * 100, 10 + index * 50, 80, 40] // Dummy bbox for classification
          }));
      }

      setDetectionData(predictions);
      setDetections(predictions);

      // Draw on canvas
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      predictions.forEach((prediction, index) => {
        const score = prediction.score.toFixed(2);
        const confidencePercent = Math.round(prediction.score * 100);

        // Different colors based on confidence
        const getColor = (score) => {
          if (score >= 0.8) return '#00ff00'; // Green for high confidence
          if (score >= 0.6) return '#ffff00'; // Yellow for medium confidence
          return '#ff6b6b'; // Red for low confidence
        };

        const color = getColor(prediction.score);

        if (prediction.bbox && modelType === 'coco-ssd') {
          // Draw bounding box for COCO-SSD
          const [x, y, width, height] = prediction.bbox;
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);

          // Draw label background
          ctx.fillStyle = color;
          const labelText = `${prediction.class} ${confidencePercent}%`;
          const textMetrics = ctx.measureText(labelText);
          ctx.fillRect(x, y - 30, textMetrics.width + 10, 25);

          // Draw label text
          ctx.fillStyle = '#000';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(labelText, x + 5, y - 10);
        } else {
          // For MobileNet or other models without bbox, show classification results
          const x = 20;
          const y = 50 + index * 40;

          // Draw background for classification result
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          const labelText = `${prediction.class} ${confidencePercent}%`;
          const textMetrics = ctx.measureText(labelText);
          ctx.fillRect(x - 5, y - 20, textMetrics.width + 10, 25);

          // Draw label text
          ctx.fillStyle = color;
          ctx.font = 'bold 16px Arial';
          ctx.fillText(labelText, x, y);
        }
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
