import React, { memo } from 'react';
import PropTypes from 'prop-types';
import '../asset/DecoView.scss';

const StickerPanel = memo(({ selectedCategory, onSelect }) => {
  const stickerCategories = [
    [
      "/images/Shape/Shape1.png",
      "/images/Shape/Shape2.png",
      "/images/Shape/Shape3.png",
      "/images/Shape/Shape4.png",
      "/images/Shape/Shape5.png",
      "/images/Shape/Shape6.png",
      "/images/Shape/Shape7.png",
      "/images/Shape/Shape8.png",
      "/images/Shape/Shape9.png",
      "/images/Shape/Shape10.png",
      "/images/Shape/Shape11.png",
      "/images/Shape/Shape12.png",
      "/images/Shape/Shape13.png",
      "/images/Shape/Shape14.png",
      "/images/Shape/Shape15.png",
    ],
    [
      "/images/Face/Face1.png",
      "/images/Face/Face2.png",
      "/images/Face/Face3.png",
      "/images/Face/Face4.png",
      "/images/Face/Face5.png",
      "/images/Face/Face6.png",
      "/images/Face/Face7.png",
    ],
    [
      "/images/LikeLion/LikeLion1.png",
      "/images/LikeLion/LikeLion2.png",
      "/images/LikeLion/LikeLion3.png",
      "/images/LikeLion/LikeLion4.png",
      "/images/LikeLion/LikeLion5.png",
    ],
    [
      "/images/Dev/Dev1.png",
      "/images/Dev/Dev2.png",
      "/images/Dev/Dev3.png",
      "/images/Dev/Dev4.png",
      "/images/Dev/Dev5.png",
      "/images/Dev/Dev6.png",
    ],
    [
      "/images/Etc/etc1.png",
      "/images/Etc/etc2.png",
      "/images/Etc/etc3.png",
      "/images/Etc/etc4.png",
      "/images/Etc/etc5.png",
      "/images/Etc/etc6.png",
    ]
    // Add more sticker paths as needed
  ];

  const stickers = stickerCategories[selectedCategory] || [];

  return (
    <div className="sticker-panel">
      {stickers.map((src, index) => (
        <img
          key={index}
          src={src}
          className='sticker-one'
          alt={`sticker-${index}`}
          draggable={false} // Disable dragging
          onClick={() => onSelect(src)} // Call onSelect when the sticker is clicked
          loading="lazy" // Lazy load the images
        />
      ))}
    </div>
  );
});

StickerPanel.propTypes = {
  selectedCategory: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default StickerPanel;
