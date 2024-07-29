import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './asset/style.scss';

const rootNode = document.getElementById('root');

ReactDOM.createRoot(rootNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')

// );
//랜더 왜 저따구로 삭제처리되는지 의문 함 봐주쇼요
