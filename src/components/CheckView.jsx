import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import '../asset/CheckView.scss';
import Loading from './Loading';

function CheckView() {
  const { capturedImage, setCapturedImage } = useContext(CaptureContext);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!capturedImage) {
      navigate('/camera');
      return;
    }

    const loadImages = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const frameImage = new Image();
      const capturedImg = new Image();

      frameImage.src = '/images/polaroid.png';
      capturedImg.src = capturedImage;

      const loadImage = (img) => {
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      };

      try {
        await Promise.all([loadImage(frameImage), loadImage(capturedImg)]);

        // Set the frame size (these dimensions should match your frame image)
        const frameWidth = 480;
        const frameHeight = 640;

        // Set the canvas size to match the frame
        canvas.width = frameWidth;
        canvas.height = frameHeight;

        context.clearRect(0, 0, frameWidth, frameHeight);

        // Define clipping region based on the actual visible frame area
        const clipX = 25; // Adjust based on your frame's visible area
        const clipY = 50; // Adjust based on your frame's visible area
        const clipWidth = 420; // Adjust based on your frame's visible area
        const clipHeight = 480; // Adjust based on your frame's visible area

        // Set the clipping path to fit the frame's visible area
        context.save();
        context.beginPath();
        context.rect(clipX, clipY, clipWidth, clipHeight);
        context.clip();

        // Calculate the aspect ratio of the image and fit it into the clipping area
        const capturedAspectRatio = capturedImg.width / capturedImg.height;
        const clipAspectRatio = clipWidth / clipHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (capturedAspectRatio > clipAspectRatio) {
          drawWidth = clipHeight * capturedAspectRatio;
          drawHeight = clipHeight;
          drawX = clipX - ((drawWidth - clipWidth) / 2);
          drawY = clipY;
        } else {
          drawWidth = clipWidth;
          drawHeight = clipWidth / capturedAspectRatio;
          drawX = clipX;
          drawY = clipY - ((drawHeight - clipHeight) / 2);
        }

        // Draw the captured image within the clipping path
        context.drawImage(capturedImg, drawX, drawY, drawWidth, drawHeight);

        // Restore the context to remove the clipping path
        context.restore();

        // Draw the frame image over the clipped image
        context.drawImage(frameImage, 0, 0, frameWidth, frameHeight);

        const finalImage = canvas.toDataURL('image/png');
        setCapturedImage((prevImage) => (prevImage === capturedImage ? finalImage : prevImage));
        setImageLoaded(true);
      } catch (error) {
        console.error('Failed to load images', error);
      }
    };

    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleRetake = () => {
    setCapturedImage(null);
    setImageLoaded(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="check-view">
      <div className="photo-frame">
        <canvas ref={canvasRef} className="result-canvas"></canvas>
        {!imageLoaded && <div><Loading /></div>}
      </div>
      <div className="button-container">
        <Link to="/camera" onClick={handleRetake}>
          <button className="retake-button">
            <img src='images/BackButton.png' alt='Back' />
            Again
          </button>
        </Link>
        <Link to="/decorate">
          <button className="next-button">
            <img src='images/NextButton.png' alt='Next' />
            Next</button>
        </Link>
      </div>
    </div>
  );
}

export default CheckView;
