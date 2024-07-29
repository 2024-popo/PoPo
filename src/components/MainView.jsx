import React from 'react';
import { Link } from 'react-router-dom';

function MainView() {
  return (
    <div className="container main-view">
      <h1>PoPo</h1>
      <Link to="/camera">
        <button>Start</button>
      </Link>
    </div>
  );
}

export default MainView;
