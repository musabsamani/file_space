import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./layouts/home/Header";
import Footer from "./layouts/home/Footer";
import Main from "./layouts/home/Main";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <Main />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
