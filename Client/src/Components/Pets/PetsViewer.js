import React, { useState } from 'react';
import AdoptForm from '../AdoptForm/AdoptForm';
import { formatDistanceToNow } from 'date-fns';

const PetsViewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className='pet-view-card'>
      <div className='pet-card-pic'>
        <img src={`${process.env.REACT_APP_API_URL}/images/${props.pet.filename}`} alt={props.pet.name} />
      </div>
      <div className='pet-card-details'>
        <h2>{props.pet.name}</h2>
        <p><b>Tip:</b> {props.pet.type}</p>
        <p><b>Vârstă:</b> {props.pet.age}</p>
        <p><b>Locație:</b> {props.pet.area}</p>
        <p>{formatTimeAgo(props.pet.updatedAt)}</p>
      </div>
      <div className='show-interest-btn'>
        <button onClick={togglePopup}>Arată interes <i className="fa fa-paw"></i></button>
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <AdoptForm closeForm={togglePopup} pet={props.pet} />
          </div>
          <button onClick={togglePopup} className='close-btn'>
            Închide <i className="fa fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default PetsViewer;
