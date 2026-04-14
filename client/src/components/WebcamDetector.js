import React, { useRef, useEffect, useState, useCallback } from 'react';
import './WebcamDetector.css';

const WebcamDetector = ({ model, setDetections, confidenceThreshold = 0.5, modelType = 'coco-ssd' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [detectionData, setDetectionData] = useState([]);
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);
  const animationIdRef = useRef(null);
  const lastDetectionTime = useRef(0);
  const frameInterval = 1000 / 10; // 10 FPS for better performance
  const frameCountRef = useRef(0);
  const fpsStartTimeRef = useRef(Date.now());

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        
        // Detect if running on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isHTTP = window.location.protocol === 'http:';
        
        if (isMobile && isHTTP) {
          alert('📱 Mobile Camera Issue:\n\nMobile browsers require HTTPS for camera access.\n\nSolutions:\n1. Use localhost on your phone (if on same WiFi)\n2. Use ngrok to create HTTPS tunnel\n3. Use from desktop/laptop\n\nError: ' + error.message);
        } else if (error.name === 'NotAllowedError') {
          alert('❌ Camera Access Denied\n\nPlease enable camera permissions in your browser settings.');
        } else if (error.name === 'NotFoundError' || error.name === 'NotReadableError') {
          alert('⚠️ No Camera Found\n\nPlease ensure your device has a working camera.\n\nError: ' + error.message);
        } else {
          alert('Unable to access webcam.\n\nError: ' + error.message);
        }
      }
    };

    startWebcam();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const video = videoRef.current;
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Non-maximum suppression to reduce overlapping detections
  const nonMaxSuppression = (predictions, iouThreshold = 0.5) => {
    if (!predictions || predictions.length === 0) return [];

    // Sort by confidence score (highest first)
    const sorted = predictions.sort((a, b) => b.score - a.score);
    const selected = [];

    while (sorted.length > 0) {
      const current = sorted.shift();
      selected.push(current);

      // Remove overlapping detections
      sorted.forEach((pred, index) => {
        const iou = calculateIoU(current.bbox, pred.bbox);
        if (iou > iouThreshold) {
          sorted.splice(index, 1);
        }
      });
    }

    return selected;
  };

  // Calculate Intersection over Union (IoU) for two bounding boxes
  const calculateIoU = (box1, box2) => {
    const [x1, y1, w1, h1] = box1;
    const [x2, y2, w2, h2] = box2;

    const box1Area = w1 * h1;
    const box2Area = w2 * h2;

    const intersectionX = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2));
    const intersectionY = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));
    const intersectionArea = intersectionX * intersectionY;

    const unionArea = box1Area + box2Area - intersectionArea;

    return unionArea === 0 ? 0 : intersectionArea / unionArea;
  };

  const detectObjects = useCallback(async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    const currentTime = Date.now();
    if (currentTime - lastDetectionTime.current < frameInterval) {
      // Throttle detection to improve performance
      if (isRunning) {
        animationIdRef.current = requestAnimationFrame(detectObjects);
      }
      return;
    }
    lastDetectionTime.current = currentTime;

    try {
      const detectionStartTime = performance.now();
      let predictions = [];

      if (modelType === 'coco-ssd') {
        predictions = await model.detect(videoRef.current);
        // Filter by confidence threshold
        predictions = predictions.filter(pred => pred.score >= confidenceThreshold);
        // Apply non-maximum suppression
        predictions = nonMaxSuppression(predictions);
      } else if (modelType === 'mobilenet') {
        // MobileNet uses classify method for image classification
        const results = await model.classify(videoRef.current);
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

      const detectionEndTime = performance.now();
      setInferenceTime(detectionEndTime - detectionStartTime);

      // Update FPS
      frameCountRef.current++;
      const currentTime = Date.now();
      const timeDiff = currentTime - fpsStartTimeRef.current;
      if (timeDiff >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        fpsStartTimeRef.current = currentTime;
      }

      setDetectionData(predictions);
      setDetections(predictions);

      // Draw bounding boxes
      const ctx = canvasRef.current.getContext('2d');

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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
    } catch (error) {
      console.error('Detection error:', error);
    }

    if (isRunning) {
      animationIdRef.current = requestAnimationFrame(detectObjects);
    }
  }, [model, isRunning, setDetections, confidenceThreshold, modelType]);

  useEffect(() => {
    if (isRunning && model) {
      animationIdRef.current = requestAnimationFrame(detectObjects);
    }
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRunning, model, detectObjects]);

  const toggleDetection = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="webcam-detector">
      <h2>📹 Real-Time Webcam Detection</h2>

      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="video-feed"
          onLoadedMetadata={() => {
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }}
        />
        <canvas ref={canvasRef} className="detection-canvas" />
        
        {isRunning && (
          <div className="detection-metrics">
            <div className="metric">
              <span className="metric-label">FPS</span>
              <span className="metric-value">{fps}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Inference</span>
              <span className="metric-value">{inferenceTime.toFixed(2)}ms</span>
            </div>
            <div className="metric">
              <span className="metric-label">Objects</span>
              <span className="metric-value">{detectionData.length}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Model</span>
              <span className="metric-value">{modelType === 'coco-ssd' ? 'COCO' : 'MobileNet'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        <button
          className={`btn btn-primary ${isRunning ? 'active' : ''}`}
          onClick={toggleDetection}
        >
          {isRunning ? '⏹️ Stop Detection' : '▶️ Start Detection'}
        </button>
      </div>

      {isRunning && (
        <div className="detection-stats">
          <div className="stats-box">
            <h4>📊 Detection Summary</h4>
            <div className="stat-item">
              <span>Total Detections:</span>
              <strong>{detectionData.length}</strong>
            </div>
            <div className="stat-item">
              <span>Unique Classes:</span>
              <strong>{new Set(detectionData.map(d => d.class)).size}</strong>
            </div>
            {detectionData.length > 0 && (
              <div className="stat-item">
                <span>Avg Confidence:</span>
                <strong>{(detectionData.reduce((sum, d) => sum + d.score, 0) / detectionData.length * 100).toFixed(1)}%</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {detectionData.length > 0 && (
        <div className="detection-results">
          <h3>🎯 Detected Objects:</h3>
          <ul>
            {detectionData.map((detection, idx) => (
              <li key={idx}>
                <strong>{detection.class}</strong>
                <span className="confidence">
                  {(detection.score * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WebcamDetector;
