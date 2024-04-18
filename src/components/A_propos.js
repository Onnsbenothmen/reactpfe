import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Effectuez un appel API pour récupérer les données de l'utilisateur
        axios.get('/user_profile')
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            {user && (
                <div>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <img src={user.profile_image} alt="Profile Image" />
                    {/* Ajoutez d'autres informations utilisateur selon vos besoins */}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
