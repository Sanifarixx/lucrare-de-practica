import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './PetCards';
import { useAuthContext } from '../../hooks/UseAuthContext';

const PostingPets = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchRequests = useCallback(async () => {
    if (!user?.token) return;
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/request`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('An error occurred while fetching requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (!user) {
    return <p>Please log in to see requests.</p>;
  }

  return (
    <div className='pet-container'>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        requests.length > 0 ? (
          requests.map((request) => (
            <PetCards
              key={request._id}
              pet={request}
              updateCards={fetchRequests}
              deleteBtnText="Reject"
              approveBtn={true}
            />
          ))
        ) : (
          <p>No requests available</p>
        )
      )}
    </div>
  );
};

export default PostingPets;
