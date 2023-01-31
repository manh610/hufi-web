import './App.css';
import 'antd/dist/antd.css'; 
import React from 'react';
import Login from './components/login'
import Manage from './components/manage';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';


function App() {
  document.title = "my-app";
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/manage" element={<Manage/>} />
      </Routes>
    </Router>
  );
    
    
}

export default App;
