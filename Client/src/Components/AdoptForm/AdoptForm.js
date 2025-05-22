import React, { useState } from "react";
import { useAuthContext } from "../../hooks/UseAuthContext";

function AdoptForm(props) {
  const { user } = useAuthContext()
  const [email, setEmail] = useState(user.email);
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ErrPopup, setErrPopup] = useState(false);
  const [SuccPopup, setSuccPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);

    if (
      !email ||
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition
    ) {
      setFormError(true);
      return;
    }

    try {

      setIsSubmitting(true)

      const response = await fetch(`${process.env.REACT_APP_API_URL}/form/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          email,
          phoneNo,
          livingSituation,
          previousExperience,
          familyComposition,
          petId: props.pet._id
        })
      })

      if (!response.ok) {
        setErrPopup(true)
        return;
      } else {
        setSuccPopup(true)
      }
    }
    catch (err) {
      setErrPopup(true)
      console.error(err);
      return;
    } finally {
      setIsSubmitting(false)

    }

    setEmailError(false);
    setFormError(false);
    setEmail("");
    setPhoneNo("");
    setLivingSituation("");
    setPreviousExperience("");
    setFamilyComposition("");
  };

  return (
    <div className="custom-adopt-form-container">
      <h2 className="custom-form-heading">Cerere de adopție animal</h2>
      <div className="form-pet-container">
        <div className="pet-details">
          <div className="pet-pic">
            <img src={`${process.env.REACT_APP_API_URL}/images/${props.pet.filename}`} alt={props.pet.name} />
          </div>
          <div className="pet-info">
            <h2>{props.pet.name}</h2>
            <p>
              <b>Tip:</b> {props.pet.type}
            </p>
            <p>
              <b>Vârstă:</b> {props.pet.age}
            </p>
            <p>
              <b>Locație:</b> {props.pet.location}
            </p>
          </div>
        </div>
        <div className="form-div">
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="custom-input-box">
              <div className="email-not-valid">
                <label className="custom-label">Email:</label>
                {emailError && (
                  <p>
                    Vă rugăm să introduceți o adresă de email validă.
                  </p>
                )}
              </div>
              <input
                type="text"
                value={email}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Număr de telefon</label>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Situația locuirii pentru animal:</label>
              <input
                type="text"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Experiență anterioară cu animale:</label>
              <input
                type="text"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Alte animale în familie:</label>
              <input
                type="text"
                value={familyComposition}
                onChange={(e) => setFamilyComposition(e.target.value)}
                className="custom-input"
              />
            </div>
            {formError && (
              <p className="error-message">Vă rugăm să completați toate câmpurile.</p>
            )}
            <button disabled={isSubmitting} type="submit" className="custom-cta-button custom-m-b">
              {isSubmitting ? 'Se trimite...' : 'Trimite'}
            </button>
            {ErrPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h4>
                    Oops!... Eroare de conexiune.
                  </h4>
                </div>
                <button onClick={(e) => (setErrPopup(!ErrPopup))} className="close-btn">
                  Închide <i className="fa fa-times"></i>
                </button>
              </div>
            )}
            {SuccPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h4>
                    Cererea de adopție pentru {props.pet.name} a fost trimisă; vă vom contacta în curând pentru pașii următori.
                  </h4>
                </div>
                <button onClick={(e) => {
                  setSuccPopup(!SuccPopup);
                  props.closeForm();
                }} className="close-btn">
                  Închide <i className="fa fa-times"></i>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdoptForm;
