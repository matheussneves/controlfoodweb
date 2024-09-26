import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import SignInSide from "./pages/sign-in-side/SignInSide"
//import Dashboard from "./pages/dashboard/Dashboard"
import MarketingPage from "./pages/marketing-page/MarketingPage"
import SignUp from "./pages/sign-up/SignUp"
function App() {
  const [count, setCount] = useState(0)
//     <Route path="/Dashboard" element={<Dashboard />} />
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/SignInSide" element={<SignInSide />} />
          <Route path="/" element={<MarketingPage />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
