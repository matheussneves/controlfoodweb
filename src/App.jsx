import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { AuthProvider } from './apis/AuthContext.jsx';
import LoginPage from "./pages/login_page/LoginPage"
import Home from "./pages/dashboard/Dashboard.tsx"
function App() {

  return (
    <div className="App">
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={< LoginPage/>} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App
