import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import StickerPanel from './StickerPanel';

function DecoView() {
  const { capturedImage } = useContext(CaptureContext);
  const [stickers, setStickers] = useState([]);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const addSticker = (src) => {
    setStickers([...stickers, { id: Date.now(), src, x: 100, y: 100 }]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const stickerSrc = e.dataTransfer.getData("text/plain");
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStickers([...stickers, { id: Date.now(), src: stickerSrc, x, y }]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeSticker = (id) => {
    setStickers(stickers.filter(sticker => sticker.id !== id));
  };

  const drawStickers = (context) => {
    return Promise.all(stickers.map(sticker => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = sticker.src;
        img.onload = () => {
          context.drawImage(img, sticker.x, sticker.y, 100, 100);
          resolve();
        };
      });
    }));
  };

  const saveImage = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();

    img.src = capturedImage;
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 좌우 반전된 이미지를 그리기
      context.drawImage(img, 0, 0);

      await drawStickers(context);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'decorated-image.png', { type: 'image/png' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'decorated-image.png';
        link.click();
      }, 'image/png');
    };
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="decorate-view" onDrop={handleDrop} onDragOver={handleDragOver}>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="photo-area">
        {capturedImage && <img src={capturedImage} alt="Captured" />}
        {stickers.map((sticker) => (
          <img
            key={sticker.id}
            src={sticker.src}
            alt="sticker"
            style={{ position: 'absolute', left: sticker.x, top: sticker.y, width: '100px', height: '100px', cursor: 'pointer' }}
            onClick={() => removeSticker(sticker.id)}
          />
        ))}
      </div>
      <div>
        <button>완성!</button>
      </div>

      <div className={`modal-container ${isModalOpen ? 'open' : ''}`}>
        <div className="modal">
          <StickerPanel onSelect={addSticker} />
        </div>
        <button
        className="toggle-modal-button"
        onClick={toggleModal}
      >
        <img src={isModalOpen ? '/images/downButton.png' : '/images/upButton.png'} onClick={toggleModal} alt="Toggle" className="updown-img" />
      </button>
      </div>
    </div>
  );

}

export default DecoView;
