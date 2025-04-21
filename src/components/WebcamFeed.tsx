import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useDispatch } from 'react-redux';
import { setFaces } from '../store/faceSlice';
import { loadModels } from '../utils/loadModels';

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
    setIsCameraOn(false);
  };

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender()
      .withFaceExpressions();

    const dims = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = dims.width;
    canvas.height = dims.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, dims.width, dims.height);

    const resized = faceapi.resizeResults(detections, dims);

    resized.forEach((det) => {
      const { x, y, width, height } = det.detection.box;
      const age = Math.round(det.age);
      const gender = det.gender;
      const expression = Object.entries(det.expressions || {}).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

      // Draw dark red rectangle around face
      ctx.strokeStyle = '#8B0000'; // Dark red
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw background for text
      const label = `${age} ${gender} ${expression}`;
      ctx.font = 'bold 20px Arial';
      const textWidth = ctx.measureText(label).width;
      const textHeight = 24;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; // semi-transparent black background
      ctx.fillRect(x, y - textHeight, textWidth + 10, textHeight);

      // Draw text in dark green
      ctx.fillStyle = '#006400'; // Dark green
      ctx.fillText(label, x + 5, y - 5);
    });

    dispatch(
      setFaces(
        resized.map((det) => ({
          age: Math.round(det.age),
          gender: det.gender,
          expression: Object.entries(det.expressions || {}).reduce((a, b) => (a[1] > b[1] ? a : b))[0],
          box: det.detection.box,
        }))
      )
    );
  };

  useEffect(() => {
    loadModels().then(() => {
      console.log('Face-api models loaded');
    });

    const interval = setInterval(() => {
      if (isCameraOn) detectFaces();
    }, 500);

    return () => clearInterval(interval);
  }, [isCameraOn]);

  return (
    <div style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ borderRadius: '8px', zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
      />
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={isCameraOn ? stopCamera : startCamera}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          {isCameraOn ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
    </div>
  );
};

export default WebcamFeed;
