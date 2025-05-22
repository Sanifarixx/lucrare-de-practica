import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/UseAuthContext';

const Profile = () => {
    const { user, dispatch } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ name: user.userName, email: user.email });
    const [tempValues, setTempValues] = useState({ name: user.userName, email: user.email });
    const [errors, setErrors] = useState([]);
    const [succMessage, setSuccMessage] = useState("");

    const handleChange = (e) => {
        setTempValues({ ...tempValues, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setErrors([]);
        setSuccMessage("");

        const newEmail = tempValues.email.toLowerCase();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: tempValues.name,
                    email: user.email,
                    newEmail: newEmail,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors([data.error]);
                setIsEditing(false);
            } else {
                setSuccMessage("Actualizat cu succes");
                setEditValues({ name: data.updatedUser.name, email: data.updatedUser.email });
                setIsEditing(false);

                dispatch({ type: 'LOGIN', payload: { ...user, userName: data.updatedUser.name, email: data.updatedUser.email } });

                localStorage.setItem('user', JSON.stringify({ ...user, userName: data.updatedUser.name, email: data.updatedUser.email }));
            }
        } catch (err) {
            setErrors(['Actualizarea profilului a eșuat.']);
        }
    };

    const handleEditClick = () => {
        setTempValues(editValues);
        setIsEditing(true);
        setSuccMessage("");
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profil</h2>
                {!isEditing ? (
                    <button className="edit-btn" onClick={handleEditClick}>Editează</button>
                ) : (
                    <button className="edit-btn" onClick={handleSave}>Salvează</button>
                )}
            </div>
            <div className="profile-info">
                <div className="profile-item">
                    <label className="profile-label">Nume:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={tempValues.name}
                            onChange={handleChange}
                            className="edit-input"
                        />
                    ) : (
                        <span className="profile-value">{editValues.name}</span>
                    )}
                </div>
                <div className="profile-item">
                    <label className="profile-label">Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={tempValues.email}
                            onChange={handleChange}
                            className="edit-input"
                        />
                    ) : (
                        <span className="profile-value">{editValues.email}</span>
                    )}
                </div>
            </div>
            <br />
            <div className="password-reset-info">
                <p>Dacă doriți să schimbați parola, vă rugăm să vă delogați și apoi să folosiți funcția „Am uitat parola”.</p>
            </div>

            {succMessage.length > 0 && (
                <div className="profile-errors-container">
                    <div className="profile-error profile-Succ-msg">
                        {succMessage}
                    </div>
                </div>
            )}

            {errors.length > 0 && (
                <div className="profile-errors-container">
                    {errors.map((error, index) => (
                        <div key={index} className="profile-error">
                            {error}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
