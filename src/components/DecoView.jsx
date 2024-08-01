import React, { useState, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import StickerPanel from './StickerPanel';
import '../asset/DecoView.scss';

function DecoView() {
  const { capturedImage } = useContext(CaptureContext);
  const [stickers, setStickers] = useState([]);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [currentSticker, setCurrentSticker] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });

  const addSticker = useCallback((src) => {
    if (!imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const defaultX = (canvasRect.width - 100) / 2;
    const defaultY = (canvasRect.height - 100) / 2;

    setStickers((prevStickers) => [
      ...prevStickers,
      { id: Date.now(), src, x: defaultX, y: defaultY, width: 100, height: 100 },
    ]);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeSticker = (id) => {
    setStickers((prevStickers) => prevStickers.filter((sticker) => sticker.id !== id));
  };

  const handleMouseDown = (e, sticker, type = 'drag') => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (type === 'resize') {
      setCurrentSticker(sticker.id);
      setResizeStart({ x: e.clientX, y: e.clientY });
      setResizing(true);
    } else {
      setCurrentSticker(sticker.id);
      setDragOffset({
        x: e.clientX - (canvasRect.left + sticker.x),
        y: e.clientY - (canvasRect.top + sticker.y),
      });
      setDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (resizing) {
      const sticker = stickers.find((sticker) => sticker.id === currentSticker);
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newDimension = Math.max(sticker.width + deltaX, sticker.height + deltaY);

      setStickers((prevStickers) =>
        prevStickers.map((s) =>
          s.id === currentSticker
            ? { ...s, width: newDimension, height: newDimension }
            : s
        )
      );

      setResizeStart({ x: e.clientX, y: e.clientY });
    } else if (dragging) {
      const x = e.clientX - canvasRect.left - dragOffset.x;
      const y = e.clientY - canvasRect.top - dragOffset.y;
      setStickers((prevStickers) =>
        prevStickers.map((sticker) =>
          sticker.id === currentSticker ? { ...sticker, x, y } : sticker
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setCurrentSticker(null);
  };

  const handleTouchStart = (e, sticker, type = 'drag') => {
    if (!canvasRef.current) return;

    const touch = e.touches[0];
    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (type === 'resize') {
      setCurrentSticker(sticker.id);
      setResizeStart({ x: touch.clientX, y: touch.clientY });
      setResizing(true);
    } else {
      setCurrentSticker(sticker.id);
      setDragOffset({
        x: touch.clientX - (canvasRect.left + sticker.x),
        y: touch.clientY - (canvasRect.top + sticker.y),
      });
      setDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!canvasRef.current) return;

    const touch = e.touches[0];
    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (resizing) {
      const sticker = stickers.find((sticker) => sticker.id === currentSticker);
      const deltaX = touch.clientX - resizeStart.x;
      const deltaY = touch.clientY - resizeStart.y;
      const newDimension = Math.max(sticker.width + deltaX, sticker.height + deltaY);

      setStickers((prevStickers) =>
        prevStickers.map((s) =>
          s.id === currentSticker
            ? { ...s, width: newDimension, height: newDimension }
            : s
        )
      );

      setResizeStart({ x: touch.clientX, y: touch.clientY });
    } else if (dragging) {
      const x = touch.clientX - canvasRect.left - dragOffset.x;
      const y = touch.clientY - canvasRect.top - dragOffset.y;
      setStickers((prevStickers) =>
        prevStickers.map((sticker) =>
          sticker.id === currentSticker ? { ...sticker, x, y } : sticker
        )
      );
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    setResizing(false);
    setCurrentSticker(null);
  };

  const drawStickers = (context, scale) => {
    return Promise.all(
      stickers.map((sticker) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = sticker.src;
          img.onload = () => {
            context.drawImage(
              img,
              sticker.x * scale,
              sticker.y * scale,
              sticker.width * scale,
              sticker.height * scale
            );
            resolve();
          };
        });
      })
    );
  };

  const prepareImageForSaving = async () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const scale = Math.min(scaleX, scaleY);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    await drawStickers(context, scale);

    return canvas.toDataURL('image/png');
  };

  const handleFinish = async () => {
    const imageUrl = await prepareImageForSaving();
    navigate('/save', { state: { imageUrl } });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const stickerCategory = [
    '/images/Shape.png',
    '/images/Face.png',
    '/images/LikeLion.png',
    '/images/Dev.png',
    '/images/etc.png',
  ];

  const [selectedCategory, setSelectedCategory] = useState(0);
  const handleCategoryClick = (index) => {
    setSelectedCategory(index);
  };

  return (
    <div
      className="decorate-view"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className='deco_line'>
        <p style={{ fontFamily: 'Pretendard', fontSize: '24px', color: '#858490', textAlign: 'center' }}>
          포포를 마음껏 꾸며보세요!
        </p>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="photo-area">
        {capturedImage && (
          <img ref={imageRef} src={capturedImage} alt="Captured" />
        )}
        {stickers.map((sticker) => {
          const buttonSize = Math.max(20, sticker.width * 0.1); // 삭제 버튼의 크기를 스티커 크기에 비례하게 조정

          return (
            <div
              key={sticker.id}
              style={{
                position: 'absolute',
                left: sticker.x,
                top: sticker.y,
                width: sticker.width,
                height: sticker.height,
                cursor: 'grab',
                userSelect: 'none',
              }}
              onMouseDown={(e) => handleMouseDown(e, sticker)}
              onTouchStart={(e) => handleTouchStart(e, sticker)}
            >
              <img
                src={sticker.src}
                alt="sticker"
                style={{
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  display: 'block',
                  position: 'relative',
                }}
              />
              <button
                className="delete-button"
                onClick={() => removeSticker(sticker.id)}
                style={{
                  position: 'absolute',
                  top: '0px', // Adjust as needed
                  right: '0px', // Adjust as needed
                  backgroundColor: 'red',
                  border: 'none',
                  color: 'white',
                  fontSize: buttonSize * 0.5, // 버튼 크기에 맞춰 폰트 크기도 조정
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  opacity: 0.8,
                  transition: 'opacity 0.3s',
                }}
              >
                ×
              </button>
              <div
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  right: '0px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  cursor: 'nwse-resize',
                }}
                onMouseDown={(e) => handleMouseDown(e, sticker, 'resize')}
                onTouchStart={(e) => handleTouchStart(e, sticker, 'resize')}
              />
            </div>
          );
        })}
      </div>

      <div>
        <button
          onClick={handleFinish}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
          }}
        >
          <img
            src={'/images/done.png'}
            alt="Finish"
            style={{ width: '50px', height: 'auto' }}
          />
        </button>
      </div>

      <div className={`modal-container ${isModalOpen ? 'open' : ''}`}>
        <div className="modal">
          <div className="sticker-list">
            {stickerCategory.map((src, index) => (
              <div
                className="sticker-choose"
                key={index}
                draggable="false" // Disable dragging
                onDragStart={(e) => e.preventDefault()} // Prevent drag events
                onClick={() => handleCategoryClick(index)} // Select category
                style={{
                  backgroundColor: selectedCategory === index ? '#8F6CF0' : '#271F3D',
                }}
              >
                <img
                  src={src}
                  className="sticker-cat"
                  alt={`sticker-category-${index}`}
                  onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                />
              </div>
            ))}
          </div>
          <StickerPanel selectedCategory={selectedCategory} onSelect={addSticker} />
        </div>

        <button className="toggle-modal-button" onClick={toggleModal}>
          <img
            src={isModalOpen ? '/images/ChevronDown.png' : '/images/chevronUp.png'}
            alt="Toggle"
            className="updown-img"
          />
        </button>
      </div>
    </div>
  );
}

export default DecoView;
