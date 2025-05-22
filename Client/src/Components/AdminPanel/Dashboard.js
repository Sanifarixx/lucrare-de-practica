import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [petData, setPetData] = useState([]);
  const [totalPets, setTotalPets] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/Dashboard/user-registrations`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUserData(userData);

        const petResponse = await fetch(`${process.env.REACT_APP_API_URL}/Dashboard/pet-types`);
        if (!petResponse.ok) throw new Error('Failed to fetch pet data');
        const petData = await petResponse.json();

        // Map data to recharts format
        const petDataMapped = petData.map(item => ({
          name: item._id,
          value: item.count
        }));

        // Calculate total number of pets
        setTotalPets(petDataMapped.reduce((acc, item) => acc + item.value, 0));
        setPetData(petDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A8E6CF', '#DCE775'];

  return (
    <div className="dashboard-container">
      <div className="total-users">
        <h2>Total Utilizatori Înregistrați</h2>
        <h3>{userData.count || 0}</h3>
      </div>

      <div className="pie-chart-container">
        <h2>Distribuția Tipurilor de Animale</h2>
        <h3>Total Animale: {totalPets}</h3>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={petData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {petData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
