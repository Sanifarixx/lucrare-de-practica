import React, { useState, useEffect, useCallback } from 'react';
import FormCard from './FormCard';
import { useAuthContext } from '../../hooks/UseAuthContext';

const AdoptingRequests = () => {
  const [forms, setForms] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetailsPopup, setPetDetailsPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState('');
  const { user } = useAuthContext();

  const fetchForms = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/form/getForms`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('A apărut o eroare');
      }
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const fetchPets = useCallback(async () => {
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
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  }, [user.token]);

  useEffect(() => {
    fetchForms();
    fetchPets();
  }, [fetchForms, fetchPets]);

  const petsWithRequests = pets.filter((pet) =>
    forms.some((form) => form.petId === pet._id)
  );

  const displayPetDetails = (pet) => {
    setSelectedPet(pet);
    setPetDetailsPopup(true);
  };

  const closePetDetailsPopup = () => {
    setPetDetailsPopup(false);
    setSelectedPet(null);
  };

  const handlePetChange = (event) => {
    setSelectedPetId(event.target.value);
  };

  const filteredPets = selectedPetId
    ? petsWithRequests.filter(pet => pet._id === selectedPetId)
    : petsWithRequests;

  return (
    <div>
      <div className="dropdown-container" style={{ textAlign: 'right', marginBottom: '20px' }}>
        <select className='req-filter-selection' onChange={handlePetChange} value={selectedPetId}>
          <option value="">Toate cererile</option>
          {petsWithRequests.map((pet) => (
            <option key={pet._id} value={pet._id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Se încarcă...</p>
      ) : filteredPets.length > 0 ? (
        filteredPets.map((pet) => {
          const petForms = forms.filter((form) => form.petId === pet._id);
          return (
            <div key={pet._id} className='form-container'>
              <div>
                <h2 className='clickable-pet-name' onClick={() => displayPetDetails(pet)}>
                  {pet.name}
                </h2>
              </div>
              <div className='form-child-container'>
                {petForms.map((form) => (
                  <FormCard
                    key={form._id}
                    form={form}
                    pet={pet}
                    updateCards={fetchForms}
                    deleteBtnText={'Respinge'}
                    approveBtn={true}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>Nu există cereri de adopție disponibile pentru niciun animal.</p>
      )}

      {petDetailsPopup && selectedPet && (
        <div className='popup'>
          <div className='popup-content'>
            <div className='pet-view-card'>
              <div className='pet-card-pic'>
                <img src={`${process.env.REACT_APP_API_URL}/images/${selectedPet.filename}`} alt={selectedPet.name} />
              </div>
              <div className='pet-card-details'>
                <h2>{selectedPet.name}</h2>
                <p><b>Tip:</b> {selectedPet.type}</p>
                <p><b>Vârstă:</b> {selectedPet.age}</p>
                <p><b>Locație:</b> {selectedPet.area}</p>
                <p><b>Email Stăpân:</b> {selectedPet.email}</p>
                <p><b>Telefon Stăpân:</b> {selectedPet.phone}</p>
                <p><b>Justificare:</b> {selectedPet.justification}</p>
              </div>
            </div>
            <button onClick={closePetDetailsPopup} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptingRequests;
