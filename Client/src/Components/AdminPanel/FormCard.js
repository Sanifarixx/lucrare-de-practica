import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/UseAuthContext';

const FormCard = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const { user } = useAuthContext();

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const deleteFormAdoptedPet = async () => {
    try {
      const deleteResponse = await fetch(`${process.env.REACT_APP_API_URL}/form/delete/many/${props.form.petId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!deleteResponse.ok) {
        throw new Error('Formularele nu au putut fi șterse');
      }
    } catch (err) {
      console.error(err);
      setShowErrorPopup(true);
    }
  }

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/approving/${props.form.petId}`, {
        method: 'PUT',
        body: JSON.stringify({
          email: props.form.email,
          phone: props.form.phoneNo,
          status: "Adoptat"
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setShowApproved(true);
        await deleteFormAdoptedPet();
      }
    } catch (err) {
      setShowErrorPopup(true);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/form/reject/${props.form._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      if (!response.ok) {
        throw new Error('Formularul nu a putut fi șters');
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Eroare la ștergerea formularului:', err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className='req-containter'>
      <div className='pet-view-card'>
        <div className='form-card-details'>
          <p><b>Email: </b> {props.form.email}</p>
          <p><b>Număr de telefon: </b> {props.form.phoneNo}</p>
          <p><b>Locuință: </b> {props.form.livingSituation}</p>
          <p><b>Experiență cu animale: </b> {props.form.previousExperience}</p>
          <p><b>Mai are alte animale? </b> {props.form.familyComposition}</p>
          <p>{formatTimeAgo(props.form.updatedAt)}</p>
        </div>

        <div className='app-rej-btn'>
          <button onClick={handleReject} disabled={isDeleting || isApproving}>
            {isDeleting ? 'Se șterge...' : props.deleteBtnText || 'Respinge'}
          </button>
          <button onClick={() => setShowDetailsPopup(true)}>Vezi complet</button>
          {props.approveBtn && (
            <button onClick={handleApprove} disabled={isDeleting || isApproving}>
              {isApproving ? 'Se aprobă...' : 'Aprobă'}
            </button>
          )}
        </div>

        {showErrorPopup && (
          <div className='popup' aria-live="polite">
            <div className='popup-content'>
              <p>Oops!... Eroare de conexiune</p>
            </div>
            <button onClick={() => setShowErrorPopup(false)} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showApproved && (
          <div className='popup' aria-live="polite">
            <div className='popup-content'>
              <p>Animalul a fost adoptat cu succes!</p>
              <p>
                Te rugăm să contactezi adoptatorul la{' '}
                <a href={`mailto:${props.form.email}`}>{props.form.email}</a>{' '}
                sau{' '}
                <a href={`tel:${props.form.phoneNo}`}>{props.form.phoneNo}</a>{' '}
                pentru a aranja transferul animalului de la centrul de adopții către locuința acestuia.
              </p>
            </div>
            <button onClick={() => { props.updateCards(); setShowApproved(false); }} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDeletedSuccess && (
          <div className='popup' aria-live="polite">
            <div className='popup-content'>
              <p>Cererea a fost respinsă cu succes.</p>
            </div>
            <button onClick={() => { setShowDeletedSuccess(false); props.updateCards(); }} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDetailsPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <h2>{props.pet.name}</h2>
              <p><b>Email: </b> {props.form.email}</p>
              <p><b>Număr de telefon: </b> {props.form.phoneNo}</p>
              <p><b>Locuință: </b> {props.form.livingSituation}</p>
              <p><b>Experiență cu animale: </b> {props.form.previousExperience}</p>
              <p><b>Mai are alte animale? </b> {props.form.familyComposition}</p>
              <p>{formatTimeAgo(props.form.updatedAt)}</p>
            </div>
            <button onClick={() => setShowDetailsPopup(false)} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FormCard;
