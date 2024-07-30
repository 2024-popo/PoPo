import React from 'react';
import { Link } from 'react-router-dom';
import "../asset/MainView.scss"

function MainView() {
  return (
    <div className="main-view-container">
      <img src='/images/MainGraphicMobile.png' alt='mainImage' className='MainGraphic' />
      <div className="header">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <Link to="/camera">
          <button className="start-button">
            <img src="/images/StartButton.png" alt="next" />
          </button>
        </Link>
      </div>
      <div className="main-view">
        <h3><strong>“포포”</strong>랑 사진 찍고 꾸미기</h3>
      </div>
    </div>
  );
}

export default MainView;
