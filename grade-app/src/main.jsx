import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './Login'
import App from './App'
import UserPoint from './UserPoint'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* 로그인 */}
        <Route path="/" element={<Login />} />

        {/* 관리자 */}
        <Route path="/admin" element={<App />} />

        {/* 일반 사용자 */}
        <Route path="/user" element={<UserPoint />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
