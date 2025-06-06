import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/UseAuthContext';

const AdoptedCards = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthContext();

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReject = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/delete/${props.pet._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Ștergerea animalului a eșuat');
      } else {
        setshowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Eroare la ștergerea animalului:', err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className='req-containter'>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>
          <img src={`${process.env.REACT_APP_API_URL}/images/${props.pet.filename}`} alt={props.pet.name} />
        </div>
        <div className='pet-card-details'>
          <h2>{props.pet.name}</h2>
          <p><b>Tip:</b> {props.pet.type}</p>
          <p><b>Email noului proprietar:</b> {props.pet.email}</p>
          <p><b>Telefon noului proprietar:</b> {props.pet.phone}</p>
          <p><b>Adoptat: </b>{formatTimeAgo(props.pet.updatedAt)}</p>
        </div>
        <div className='app-rej-btn'>
          <button onClick={handleReject} disabled={isDeleting}>
            {isDeleting ? (<p>Se șterge...</p>) : (props.deleteBtnText)}
          </button>
        </div>

        {showErrorPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Oops!... Eroare de conexiune</p>
            </div>
            <button onClick={() => setShowErrorPopup(!showErrorPopup)} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showApproved && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Adopția a fost aprobată cu succes...</p>
              <p>
                Te rugăm să contactezi clientul la{' '}
                <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a>{' '}
                sau{' '}
                <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a>{' '}
                pentru a stabili transferul animalului de la domiciliul proprietarului către centrul nostru de adopții.
              </p>
            </div>
            <button onClick={() => {
              setShowApproved(!showApproved)
              props.updateCards()
            }} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDeletedSuccess && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Șters cu succes din baza de date...</p>
            </div>
            <button onClick={() => {
              setshowDeletedSuccess(!showDeletedSuccess)
              props.updateCards()
            }} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdoptedCards;
