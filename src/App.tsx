// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DrawingList from "./components/DrawingList";
import DrawingEditor from "./components/DrawingEditor";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DrawingList />} />
        <Route path="/drawing/:id" element={<DrawingEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
