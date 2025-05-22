import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/UseAuthContext';

const PetCards = (props) => {
  const [afiseazaJustificare, setAfiseazaJustificare] = useState(false);
  const [afiseazaEroare, setAfiseazaEroare] = useState(false);
  const [afiseazaAprobat, setAfiseazaAprobat] = useState(false);
  const [afiseazaSuccesStergere, setAfiseazaSuccesStergere] = useState(false);
  const [seSterge, setSeSterge] = useState(false);
  const [seAproba, setSeAproba] = useState(false);
  const { user } = useAuthContext();

  const trunchiazaText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const lungimeMaxima = 40;

  const formateazaTimpul = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const aproba = async () => {
    setSeAproba(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/approving/${props.pet._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: "Approved"
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        setAfiseazaEroare(true);
      } else {
        setAfiseazaAprobat(true);
      }
    } catch (err) {
      setAfiseazaEroare(true);
    } finally {
      setSeAproba(false);
    }
  };

  const stergeFormulareAdoptie = async () => {
    setSeSterge(true);
    try {
      const deleteResponses = await fetch(`${process.env.REACT_APP_API_URL}/form/delete/many/${props.pet._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!deleteResponses.ok) {
        throw new Error('Ștergerea formularelor a eșuat');
      }
    } catch (err) {
      // Poți afișa o eroare aici dacă dorești
    } finally {
      respinge();
    }
  };

  const respinge = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/delete/${props.pet._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        setAfiseazaEroare(true);
        throw new Error('Ștergerea animalului a eșuat');
      } else {
        setAfiseazaSuccesStergere(true);
      }
    } catch (err) {
      setAfiseazaEroare(true);
      console.error('Eroare la ștergerea animalului:', err);
    } finally {
      setSeSterge(false);
    }
  };

  return (
    <div className='req-containter'>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>
          <img src={`${process.env.REACT_APP_API_URL}/images/${props.pet.filename}`} alt={props.pet.name} />
        </div>
        <div className='pet-card-details'>
          <h2>{props.pet.name}</h2>
          <p><b>Tip:</b> {props.pet.type}</p>
          <p><b>Vârstă:</b> {props.pet.age}</p>
          <p><b>Locație:</b> {props.pet.area}</p>
          <p><b>Email proprietar:</b> {props.pet.email}</p>
          <p><b>Telefon proprietar:</b> {props.pet.phone}</p>
          <p>
            <b>Justificare:</b>
            <span>
              {trunchiazaText(props.pet.justification, lungimeMaxima)}
              {props.pet.justification.length > lungimeMaxima && (
                <span
                  onClick={() => setAfiseazaJustificare(prev => !prev)}
                  className='read-more-btn'
                >
                  Citește mai mult
                </span>
              )}
            </span>
          </p>
          <p>{formateazaTimpul(props.pet.updatedAt)}</p>
        </div>
        <div className='app-rej-btn'>
          <button onClick={stergeFormulareAdoptie} disabled={seSterge || seAproba}>
            {seSterge ? (<p>Se șterge...</p>) : (props.deleteBtnText)}
          </button>
          {props.approveBtn && (
            <button disabled={seSterge || seAproba} onClick={aproba}>
              {seAproba ? (<p>Se aprobă...</p>) : 'Aprobă'}
            </button>
          )}
        </div>

        {afiseazaJustificare && (
          <div className='popup'>
            <div className='popup-content'>
              <h4>Justificare:</h4>
              <p>{props.pet.justification}</p>
            </div>
            <button
              onClick={() => setAfiseazaJustificare(prev => !prev)}
              className='close-btn'
            >
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {afiseazaEroare && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Ups!... Eroare de conexiune</p>
            </div>
            <button onClick={() => setAfiseazaEroare(false)} className='close-btn'>
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {afiseazaAprobat && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Adopția a fost aprobată cu succes...</p>
              <p>
                Vă rugăm să contactați clientul la{' '}
                <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a>{' '}
                sau{' '}
                <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a>{' '}
                pentru a aranja transferul animalului de la locuința proprietarului către centrul nostru de adopții.
              </p>
            </div>
            <button
              onClick={() => {
                setAfiseazaAprobat(false);
                props.updateCards();
              }}
              className='close-btn'
            >
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {afiseazaSuccesStergere && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Șters cu succes din baza de date...</p>
            </div>
            <button
              onClick={() => {
                setAfiseazaSuccesStergere(false);
                props.updateCards();
              }}
              className='close-btn'
            >
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PetCards;
