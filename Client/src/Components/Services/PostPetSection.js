import React, { useState, useEffect } from "react";
import postPet from "./images/postPet.png";
import { useAuthContext } from "../../hooks/UseAuthContext";

const PostPetSection = () => {
  const { user } = useAuthContext();
  const [name, setName] = useState(user.userName);
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [justification, setJustification] = useState("");
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [type, setType] = useState("None");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setAgeError(false);
      setFormError(false);
    }
  }, [isSubmitting]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !age ||
      !area ||
      !justification ||
      !email ||
      !phone ||
      !fileName ||
      type === "None" ||
      ageError
    ) {
      setFormError(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("area", area);
    formData.append("justification", justification);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type);

    if (picture) {
      formData.append("picture", picture);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/services`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Formularul a fost trimis cu succes");

      setEmailError(false);
      setFormError(false);
      setName("");
      setAge("");
      setArea("");
      setJustification("");
      setEmail("");
      setPhone("");
      setPicture(null);
      setFileName("");
      togglePopup();
    } catch (error) {
      console.error("Eroare la trimiterea formularului:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="post-pet-section">
      <h2>Publică un animal spre adopție</h2>
      <img src={postPet} alt="Animal în căutarea unei case" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="input-box">
          <label>Nume:</label>
          <input
            type="text"
            value={name}
          />
        </div>

        <div className="input-box">
          <label>Vârsta animalului:</label>
          <input
            type="text"
            value={age}
            onChange={(e) => { setAge(e.target.value); }}
          />
        </div>

        <div className="input-box">
          <label>Fotografie:</label>
          <label className="file-input-label">
            <span className="file-input-text">
              {fileName || "Fotografie"}
            </span>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="input-box">
          <label>Locație:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <div className="filter-selection-service">
          <label>Tip:</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="None">Niciunul</option>
            <option value="Dog">Câine</option>
            <option value="Cat">Pisică</option>
            <option value="Rabbit">Iepure</option>
            <option value="Bird">Pasăre</option>
            <option value="Fish">Pește</option>
            <option value="Other">Altul</option>
          </select>
        </div>

        <div className="input-box">
          <h3>Motivul pentru care oferi animalul</h3>
          <textarea
            rows="4"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          ></textarea>
        </div>

        <h3>Informații de contact</h3>

        <div className="input-box">
          <label>Email:</label>
          <input
            type="text"
            value={email}
          />
        </div>

        <div className="input-box">
          <label>Nr. Tel:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {emailError && (
          <p className="error-message">Te rugăm să introduci o adresă de email validă.</p>
        )}
        {formError && (
          <p className="error-message">Te rugăm să completezi toate câmpurile corect.</p>
        )}

        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Se trimite..." : "Trimite animalul tău"}
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Cererea a fost trimisă; te vom contacta în curând.</h4>
            </div>
            <button onClick={togglePopup} className="close-btn">
              Închide <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default PostPetSection;
