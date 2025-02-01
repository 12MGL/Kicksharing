import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Repair from "./pages/Repair";
import History from "./pages/History";
import Profile from "./pages/Profile";

const AppRouter = () => {
  const [selectedScooter, setSelectedScooter] = useState(null);
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home onSelectScooter={setSelectedScooter} />} />
          <Route path="/repair/:id" element={<Repair scooter={selectedScooter}/>} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
