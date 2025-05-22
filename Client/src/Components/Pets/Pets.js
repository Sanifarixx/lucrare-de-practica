import React, { useEffect, useState } from "react";
import PetsViewer from "./PetsViewer";
import { useAuthContext } from "../../hooks/UseAuthContext";

const Pets = () => {
  const [filter, setFilter] = useState("all");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !user.token) {
        setError('Utilizatorul nu este autentificat');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/approvedPets`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Eroare la preluarea datelor despre animale');
        }
        const data = await response.json();
        setPetsData(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('A apărut o eroare la preluarea datelor');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const filteredPets = petsData.filter((pet) => {
    if (filter === "all") {
      return true;
    }
    return pet.type === filter;
  });

  return (
    <>
      <div className="filter-selection">
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">Toate Animalele</option>
          <option value="Dog">Câini</option>
          <option value="Cat">Pisici</option>
          <option value="Rabbit">Iepuri</option>
          <option value="Bird">Păsări</option>
          <option value="Fish">Pești</option>
          <option value="Other">Altele</option>
        </select>
      </div>
      <div className="pet-container">
        {loading ? (
          <p>Se încarcă...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((petDetail, index) => (
            <PetsViewer pet={petDetail} key={index} />
          ))
        ) : (
          <p className="oops-msg">Ups!... Nu există animale disponibile</p>
        )}
      </div>
    </>
  );
};

export default Pets;
