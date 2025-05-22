import React, { useState, useEffect, useCallback } from 'react';
import AdoptedCards from './AdoptedCards';
import { useAuthContext } from '../../hooks/UseAuthContext';

const AdoptedHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchAdoptedPets = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/adoptedPets`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('A apărut o eroare la preluarea animalelor adoptate');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Eroare la preluarea animalelor adoptate:', error);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchAdoptedPets();
  }, [fetchAdoptedPets]);

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Se încarcă...</p>
      ) :
        requests.length > 0 ? (
          requests.map((request) => (
            <AdoptedCards
              key={request._id}
              pet={request}
              updateCards={fetchAdoptedPets}
              deleteBtnText="Șterge Istoricul"
              approveBtn={false}
            />
          ))
        ) : (
          <p>Nu există animale adoptate disponibile</p>
        )}
    </div>
  );
};

export default AdoptedHistory;
