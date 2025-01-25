import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/home'; // Home 컴포넌트 경로
import './App.css'; // 스타일 파일

function App() {
  return (
    <Router>
      <div className="App">
        {/* 라우터로 각 페이지를 렌더링 */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* 기본 경로에 Home 연결 */}
          {/* 다른 페이지 경로를 추가하려면 여기에 Route 추가 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
