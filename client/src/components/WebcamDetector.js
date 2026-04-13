import React, { useRef, useEffect, useState, useCallback } from 'react';
import './WebcamDetector.css';

const WebcamDetector = ({ model, setDetections }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [detectionData, setDetectionData] = useState([]);
  const animationIdRef = useRef(null);

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

  const detectObjects = useCallback(async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    const predictions = await model.detect(videoRef.current);
    setDetectionData(predictions);
    setDetections(predictions);

    // Draw bounding boxes
    const ctx = canvasRef.current.getContext('2d');

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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

    if (isRunning) {
      animationIdRef.current = requestAnimationFrame(detectObjects);
    }
  }, [model, isRunning, setDetections]);

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
      </div>

      <div className="controls">
        <button
          className={`btn btn-primary ${isRunning ? 'active' : ''}`}
          onClick={toggleDetection}
        >
          {isRunning ? '⏹️ Stop Detection' : '▶️ Start Detection'}
        </button>
      </div>

      {detectionData.length > 0 && (
        <div className="detection-results">
          <h3>Detected Objects:</h3>
          <ul>
            {detectionData.map((detection, idx) => (
              <li key={idx}>
                <strong>{detection.class}</strong>
                <span className="confidence">
                  Confidence: {(detection.score * 100).toFixed(1)}%
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
