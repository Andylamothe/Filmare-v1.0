import React, { useState } from 'react';
import '../LeCss/chat.css';
import { useNavigate } from 'react-router-dom';

export default function ChatText({auth, setAuth}) {
  const navigate = useNavigate();
  if (!auth) {
    console.log("veuillez vous connecter");
    navigate("/login");
    return null;
  }



  return (

    <div className="chat-container">
      <h1 className="nonfunctional" >Fonctionnalitée pas implémentée</h1>
    </div>
  );
}
