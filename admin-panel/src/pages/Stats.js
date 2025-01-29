import React, { useState, useEffect } from "react";
import { getStats } from "../api";

const Stats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      console.log("Полученные данные:", data); //дебажноэ
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div style={{ marginLeft: "260px", padding: "20px" }}>
      <h1>Статистика ремонтов</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Самокат</th>
            <th>Ремонтник</th>
            <th>Узел</th>
            <th>Тип ремонта</th>
            <th>Успешность</th>
          </tr>
        </thead>
        <tbody>
          {stats.length > 0 ? (
            stats.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.repair_timestamp}</td>
                <td>{item.scooter_id}</td>
                <td>{item.repairman_id}</td>
                <td>{item.node}</td>
                <td>{item.repair_type}</td>
                <td>{item.success ? "✔" : "✖"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Загрузка данных...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Stats;
