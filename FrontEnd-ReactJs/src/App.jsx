import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import NotFound from "./pages/NotFound.jsx";
import HomePage from "./pages/HomePage.jsx";
import React from "react";
import './App.css'
import Feed from "./pages/Feed.jsx";
import Login from "./pages/Login.jsx";
import ChatText from "./pages/ChatText.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile.jsx";
import Watch from "./pages/Watch.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import { useState } from "react"
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [auth, setAuth] = useState(false);
  return (
    <>
      <BrowserRouter> 
        <Header auth={auth} setAuth={setAuth}/>
          <div>
            <Routes> 
              {/* Routes publiques */}
              <Route path='/' element={<HomePage />} />
              <Route path='/about' element={<About/>} />
              <Route path='/login' element={<Login auth={auth} setAuth={setAuth}/>} />
              <Route path='/register' element={<Register auth={auth} setAuth={setAuth}/>} />
              
              {/* Routes protégées */}
              <Route path='/feed' element={
                <ProtectedRoute auth={auth}>
                  <Feed auth={auth} setAuth={setAuth}/>
                </ProtectedRoute>
              } />
              <Route path='/chat' element={
                <ProtectedRoute auth={auth}>
                  <ChatText auth={auth} setAuth={setAuth}/>
                </ProtectedRoute>
              } />
              <Route path='/upload' element={
                <ProtectedRoute auth={auth}>
                  <Upload auth={auth} setAuth={setAuth}/>
                </ProtectedRoute>
              } />
              <Route path='/profile/:id' element={
                <ProtectedRoute auth={auth}>
                  <Profile auth={auth} setAuth={setAuth}/>
                </ProtectedRoute>
              } />
              <Route path='/watch/:id' element={
                <ProtectedRoute auth={auth}>
                  <Watch auth={auth} setAuth={setAuth}/>
                </ProtectedRoute>
              } />
              
              {/* Route 404 */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        <Footer />  
      </BrowserRouter>
    </>
  )
}

export default App
