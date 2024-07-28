import React from 'react';
import { Link } from 'react-router-dom';

function MainView() {
  return (
    <div className="main-view">
      <h1>PolPol</h1>
      <Link to="/camera">
        <button>Start</button>
      </Link>
    </div>
  );
}

export default MainView;
