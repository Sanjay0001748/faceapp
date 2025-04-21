import React, { useRef } from 'react';
import * as faceapi from 'face-api.js';
import { useDispatch } from 'react-redux';
import { setFaces } from '../store/faceSlice';
import { loadModels } from '../utils/loadModels';

const UploadImage: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !imageRef.current) return;

    await loadModels();
    const imgUrl = URL.createObjectURL(file);
    imageRef.current.src = imgUrl;
  };

  const handleImageLoad = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const dims = {
      width: imageRef.current.width,
      height: imageRef.current.height,
    };

    canvasRef.current.width = dims.width;
    canvasRef.current.height = dims.height;

    const detections = await faceapi
      .detectAllFaces(imageRef.current, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender()
      .withFaceExpressions();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, dims.width, dims.height);

    const resized = faceapi.resizeResults(detections, dims);

    resized.forEach((det) => {
      const { x, y, width, height } = det.detection.box;
      const age = Math.round(det.age);
      const gender = det.gender;
      const expression = Object.entries(det.expressions || {}).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      const label = `${age} ${gender} ${expression}`;

      // Draw dark blue rectangle
      ctx.strokeStyle = '#00008B'; // Dark blue
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw label with dark red color
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#8B0000'; // Dark red
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

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        minHeight: '100vh', // Full page height
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          ref={imageRef}
          alt="upload"
          width="640"
          height="480"
          onLoad={handleImageLoad}
          style={{ borderRadius: '8px', zIndex: 1 }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default UploadImage;
