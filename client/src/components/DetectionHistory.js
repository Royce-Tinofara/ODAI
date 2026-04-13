import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DetectionHistory.css';

const DetectionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="detection-history">
      <h2>📊 Detection History</h2>

      <div className="history-controls">
        <button className="btn btn-refresh" onClick={fetchHistory}>
          🔄 Refresh
        </button>
        <p className="history-count">Total Detections: {history.length}</p>
      </div>

      {loading && <div className="loading">Loading history...</div>}

      {history.length === 0 ? (
        <div className="no-history">
          <p>No detections yet. Start by using the webcam or uploading an image!</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((detection) => (
            <div key={detection.id} className="history-card">
              <div className="card-title">
                <span className="file-name">{detection.originalName}</span>
                <span className="detection-id">ID: {detection.id.slice(0, 8)}</span>
              </div>

              <div className="card-timestamp">
                <span>📅 {formatDate(detection.timestamp)}</span>
              </div>

              {detection.objects && detection.objects.length > 0 ? (
                <div className="card-objects">
                  <p className="objects-label">Objects Detected:</p>
                  <ul>
                    {detection.objects.map((obj, idx) => (
                      <li key={idx}>
                        {obj.class || obj} -{' '}
                        {obj.score
                          ? `${(obj.score * 100).toFixed(1)}%`
                          : 'N/A'}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="card-objects">
                  <p className="no-objects">No objects detected</p>
                </div>
              )}

              <div className="card-stats">
                <span>Confidence: {(detection.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionHistory;
