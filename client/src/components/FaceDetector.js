import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import './FaceDetector.css';

const FaceDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [faceData, setFaceData] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading face detection models...');
  const animationIdRef = useRef(null);
  const lastDetectionTime = useRef(0);
  const frameInterval = 1000 / 8; // 8 FPS for face detection

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setLoadingMessage('');
        console.log('✓ Face detection models loaded');
      } catch (error) {
        console.error('Error loading face models:', error);
        setLoadingMessage('Failed to load models. Please refresh.');
      }
    };

    loadModels();
  }, []);

  // Start webcam
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
        setLoadingMessage('Camera access denied. Please enable camera permissions.');
      }
    };

    if (modelsLoaded) {
      startWebcam();
    }

    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [modelsLoaded]);

  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const currentTime = Date.now();
    if (currentTime - lastDetectionTime.current < frameInterval) {
      if (isRunning) {
        animationIdRef.current = requestAnimationFrame(detectFaces);
      }
      return;
    }
    lastDetectionTime.current = currentTime;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw detections
      detections.forEach((detection, idx) => {
        const box = detection.detection.box;
        const age = Math.round(detection.age);
        const gender = detection.gender;
        const genderProbability = Math.round(detection.genderProbability * 100);

        // Draw bounding box
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Draw label background
        const labelText = `${gender} | Age: ${age}`;
        ctx.fillStyle = 'rgba(0, 217, 255, 0.9)';
        const textMetrics = ctx.measureText(labelText);
        ctx.fillRect(box.x, box.y - 35, textMetrics.width + 20, 30);

        // Draw label text
        ctx.fillStyle = '#0f1419';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(labelText, box.x + 10, box.y - 12);

        // Draw confidence
        const confidenceText = `${genderProbability}% confident`;
        ctx.fillStyle = 'rgba(131, 56, 236, 0.9)';
        const confidenceMetrics = ctx.measureText(confidenceText);
        ctx.fillRect(box.x, box.y + box.height + 5, confidenceMetrics.width + 10, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(confidenceText, box.x + 5, box.y + box.height + 20);
      });

      setFaceData(detections);
    } catch (error) {
      console.error('Face detection error:', error);
    }

    if (isRunning) {
      animationIdRef.current = requestAnimationFrame(detectFaces);
    }
  }, [isRunning, modelsLoaded]);

  useEffect(() => {
    if (isRunning && modelsLoaded) {
      animationIdRef.current = requestAnimationFrame(detectFaces);
    }
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRunning, modelsLoaded, detectFaces]);

  const toggleDetection = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="face-detector">
      <h2>👤 Face Detection & Analysis</h2>

      {loadingMessage && (
        <div className="loading-message">
          <div className="spinner-small"></div>
          <p>{loadingMessage}</p>
        </div>
      )}

      {!loadingMessage && (
        <>
          <div className="video-container-face">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="video-feed-face"
              onLoadedMetadata={() => {
                if (canvasRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth;
                  canvasRef.current.height = videoRef.current.videoHeight;
                }
              }}
            />
            <canvas ref={canvasRef} className="detection-canvas-face" />
          </div>

          <div className="controls-face">
            <button
              className={`btn btn-face ${isRunning ? 'active' : ''}`}
              onClick={toggleDetection}
            >
              {isRunning ? '⏹️ Stop Detection' : '▶️ Start Detection'}
            </button>
          </div>

          {faceData.length > 0 && (
            <div className="face-results">
              <h3>👥 Detected Faces: {faceData.length}</h3>
              <div className="faces-grid">
                {faceData.map((face, idx) => {
                  const age = Math.round(face.age);
                  const gender = face.gender;
                  const confidence = Math.round(face.genderProbability * 100);

                  return (
                    <div key={idx} className="face-card">
                      <div className="face-header">
                        <span className="face-number">Face #{idx + 1}</span>
                      </div>
                      <div className="face-info">
                        <div className="info-item">
                          <span className="info-label">👤 Gender:</span>
                          <span className="info-value">{gender}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">📅 Age:</span>
                          <span className="info-value">{age} years</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">🎯 Confidence:</span>
                          <span className="info-value">{confidence}%</span>
                        </div>
                      </div>
                      <div className="face-stats">
                        <div className="stat-bar">
                          <div className="stat-label">Confidence</div>
                          <div className="stat-progress">
                            <div
                              className="stat-fill"
                              style={{ width: `${confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isRunning && faceData.length === 0 && (
            <div className="no-faces">
              <p>👀 Waiting for faces to be detected...</p>
              <small>Make sure you're in good lighting and facing the camera</small>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaceDetector;
