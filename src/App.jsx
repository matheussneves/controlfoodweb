import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import LoginPage from "./pages/login_page/LoginPage"
import Home from "./pages/dashboard/Dashboard.tsx"
function App() {
  const [count, setCount] = useState(0)
//     <Route path="/Dashboard" element={<Dashboard />} />
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={< LoginPage/>} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
