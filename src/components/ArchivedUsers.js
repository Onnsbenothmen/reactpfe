import React, { useState, useEffect } from 'react';

function ArchivedUsers() {
    const [archivedUsers, setArchivedUsers] = useState([]);

    useEffect(() => {
        fetchArchivedUsers();
    }, []);

    const fetchArchivedUsers = () => {
        fetch('http://127.0.0.1:5000/api/archived-users')
            .then(response => response.json())
            .then(data => setArchivedUsers(data))
            .catch(error => console.error('Erreur lors de la récupération des utilisateurs archivés:', error));
    };

    const handleActivateUser = (userId) => {
        fetch(`http://127.0.0.1:5000/api/activate-user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                fetchArchivedUsers();
            } else {
                console.error('Erreur lors de l\'activation de l\'utilisateur');
            }
        })
        .catch(error => console.error('Erreur lors de l\'activation de l\'utilisateur:', error));
    };

    return (
        <div>
            <h1>Liste des utilisateurs désactivés</h1>
            <ul>
                {archivedUsers.map(user => (
                    <li key={user.id}>
                        {user.firstName} {user.lastName} - {user.email}
                        <button onClick={() => handleActivateUser(user.id)}>Activer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ArchivedUsers;
