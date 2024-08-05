import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../asset/SavePage.scss';

function SavePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl } = location.state || {}; // Retrieve imageUrl from location state
  console.log('Image URL:', imageUrl);
  
  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'decorated-image.png';
    link.click();
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className='savepage-view'>
      <p className="save-title">저장하기</p>
      {imageUrl ? (
        <div className="image-preview">
          <img src={imageUrl} alt="Decorated" className="decorated-image" />
        </div>
      ) : (
        <p className="error-message">이미지를 불러오는데 문제가 발생했습니다.</p>
      )}
      <div className="action-buttons">
        <button className="home-button" onClick={handleHome} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
          <img src="/images/HomeButton.png" alt="Home" style={{ width: '50px', height: 'auto' }} />
          <span>Home</span>
        </button>
        <button className="download-button" onClick={handleDownload} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
          <img src="/images/DownloadButton.png" alt="Download" style={{ width: '50px', height: 'auto' }} />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}

export default SavePage;