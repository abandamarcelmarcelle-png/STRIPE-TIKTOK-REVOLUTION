import React from 'react';
import { Camera, Upload, Share2 } from 'lucide-react';

function CameraScreen() {
  const [recordingState, setRecordingState] = React.useState('idle'); // idle, recording, uploaded

  return (
    <div className="camera-screen">
      <div className="camera-container">
        <div className="camera-preview">
          <div className="camera-placeholder">
            <Camera size={64} color="rgba(99, 91, 255, 0.5)" />
            <p>Camera Access Required</p>
          </div>
        </div>

        <div className="camera-controls">
          {recordingState === 'idle' && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => setRecordingState('recording')}
              >
                <Camera size={20} /> Start Recording
              </button>
              <button className="btn btn-secondary">
                <Upload size={20} /> Upload Video
              </button>
            </>
          )}
          {recordingState === 'recording' && (
            <button
              className="btn btn-alert"
              onClick={() => setRecordingState('uploaded')}
            >
              Stop Recording
            </button>
          )}
          {recordingState === 'uploaded' && (
            <button className="btn btn-primary">
              <Share2 size={20} /> Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraScreen;
