import React, { useState, useEffect } from 'react';


const Dashboard = () => {
    const homeUrl = "localhost:8080/api/home";
    const adminUrl = "localhost:8080/api/admin/request";

    const [objects, setObjects] = useState([]);
    
    useEffect(() => {
        fetchObjects();
    }, []);

    const fetchObjects = async () => {
        try {
            const response = await fetch(`${homeUrl}/marines`);
            const data = await response.json();
            setObjects(data);
        } catch (error) {
            console.error('Error fetching objects:', error);
        }
    };

    const handleSendModeratorRequest = async () => {
        try {
            await fetch(adminUrl, { method: 'POST' });
            alert('Moderator request sent successfully!');
        } catch (error) {
            console.error('Error sending moderator request:', error);
        }
    };

    return (
        <div className="home-page">
            {/* <div className="user-info">
                <span>Welcome, {user.username}</span>
                <button onClick={handleSendModeratorRequest}>Request Moderator</button>
                <button onClick={onLogout}>Logout</button>
            </div> */}
            <h1>Objects Table</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {objects.map(object => (
                        <tr key={object.id}>
                            <td>{object.id}</td>
                            <td>{object.name}</td>
                            <td>{object.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
