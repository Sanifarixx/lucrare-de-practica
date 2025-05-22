import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './PetCards';
import { useAuthContext } from '../../hooks/UseAuthContext';

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/approvedPets`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('A apărut o eroare');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        requests.length > 0 ? (
          requests.map((request) => (
            <PetCards
              key={request._id}
              pet={request}
              updateCards={fetchRequests}
              deleteBtnText={"Șterge postarea"}
              approveBtn={false}
            />
          ))
        ) : (
          <p>Nu există animale aprobate disponibile</p>
        )
      )}
    </div>
  );
};

export default ApprovedRequests;
