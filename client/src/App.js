import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import WebcamDetector from './components/WebcamDetector';
import ImageUploader from './components/ImageUploader';
import DetectionHistory from './components/DetectionHistory';
import './App.css';

// Set the backend to WebGL (or fallback to CPU)
tf.setBackend('webgl');
tf.ready().then(() => {
  console.log('TensorFlow.js backend ready:', tf.getBackend());
}).catch(err => {
  console.warn('WebGL backend failed, falling back to CPU:', err);
  tf.setBackend('cpu');
  tf.ready().then(() => {
    console.log('TensorFlow.js backend (CPU):', tf.getBackend());
  });
});

function App() {
  const [activeTab, setActiveTab] = useState('webcam');
  const [_, setDetections] = useState([]);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('coco-ssd');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  // Load the selected model on component mount or model change
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        let loadedModel;

        if (selectedModel === 'coco-ssd') {
          loadedModel = await cocoSsd.load();
          console.log('✓ COCO-SSD Model loaded successfully');
        } else if (selectedModel === 'mobilenet') {
          loadedModel = await mobilenet.load();
          console.log('✓ MobileNet Model loaded successfully');
        }

        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [selectedModel]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>ODAI (Object Detection AI)</h1>
        <p>Real time object detection</p>
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading AI Model...</p>
        </div>
      )}

      {!loading && (
        <main className="app-main">
          {/* Model Configuration */}
          <div className="model-config">
            <div className="config-group">
              <label>
                <span>🤖 AI Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="coco-ssd">COCO-SSD (80 objects) - Fast & Accurate</option>
                  <option value="mobilenet">MobileNet (1000 classes) - Comprehensive</option>
                </select>
              </label>
            </div>
            <div className="config-group">
              <label>
                <span>🎯 Confidence Threshold: {Math.round(confidenceThreshold * 100)}%</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                />
              </label>
            </div>
          </div>

          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'webcam' ? 'active' : ''}`}
              onClick={() => setActiveTab('webcam')}
            >
              📹 Webcam Detection
            </button>
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              📤 Image Upload
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📊 History
            </button>
          </nav>

          <div className="content">
            {activeTab === 'webcam' && model && (
              <WebcamDetector
                model={model}
                setDetections={setDetections}
                confidenceThreshold={confidenceThreshold}
                modelType={selectedModel}
              />
            )}
            {activeTab === 'upload' && model && (
              <ImageUploader
                model={model}
                setDetections={setDetections}
                confidenceThreshold={confidenceThreshold}
                modelType={selectedModel}
              />
            )}
            {activeTab === 'history' && <DetectionHistory />}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
