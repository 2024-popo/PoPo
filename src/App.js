import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainView from './components/MainView';
import CameraView from './components/CameraView'; //jsx에서 만든 카메라 컴포넌트를 불러와여이
import CheckView from './components/CheckView';
import DecorateView from './components/DecoView';
import SavePage from './components/SavePage';
import { CaptureProvider } from './contexts/CaptureContext'; //이거는 캡처화면 유지하려고
import './asset/style.scss';

function App() {
  return (
    <CaptureProvider>
      <Router>
        <Routes>
         <Route path="/" element={<MainView />} />
         <Route path="/camera" element={<CameraView />} />
         <Route path="/check" element={<CheckView />} />
          <Route path="/decorate" element={<DecorateView />} />
          <Route path="/save" element={<SavePage/>}/>
        </Routes>
     </Router>
    </CaptureProvider>
  );
}

export default App;