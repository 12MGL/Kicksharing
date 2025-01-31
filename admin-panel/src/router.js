import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Scooters from "./pages/Scooters";
import Parts from "./pages/Parts"; 
import Repairmen from "./pages/Repairmen"; 
import Logs from "./pages/Logs";

const AppRouter = () => {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/scooters" element={<Scooters />} />
        <Route path="/parts" element={<Parts />} /> 
        <Route path="/repairmen" element={<Repairmen />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
