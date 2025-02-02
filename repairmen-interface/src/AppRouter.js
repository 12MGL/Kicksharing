import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Repair from "./pages/Repair";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

const AppRouter = () => {
  const [selectedScooter, setSelectedScooter] = useState(null);
  const [repairman, setRepairman] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
        //тут можно добавить проверку токена
        setRepairman({ id: 2, username: "Тестовый ремонтник", service_center_id: 4 }); //заглушка
    }, []);

  return (
    <Router>
      <Routes>
      {!repairman ? (
          <Route path="*" element={<Login setRepairman={setRepairman} />} />
            ) : (
                <Route
                path="*"
                element={
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home onSelectScooter={setSelectedScooter}/>} />
                            <Route path="/repair/:id" element={<Repair scooter={selectedScooter}/>} />
                            <Route path="/history" element={<History />} />
                            <Route path="/profile" element={<Profile repairman={repairman}/>} />
                        </Routes>
                    </Layout>
                }
                />
            )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
