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
    <div className="max-w-5xl m-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mt-6 mb-1">Space Marine Dashboard</h1>
      <div className="flex justify-end">
        <Link
          class="rounded-md bg-sky-600 py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-sky-700 focus:shadow-none active:bg-sky-700 hover:bg-sky-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          to={"/marines/new"}
        >
          New Space Marine
        </Link>
      </div>
      <table className="min-w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className={thStyles}>ID</th>
            <th className={thStyles}>Name</th>
            <th className={thStyles}>Creation Date</th>
            <th className={thStyles}>Health</th>
            <th className={thStyles}>Weapon</th>
            <th className={thStyles}>Melee Weapon</th>
            <th className={thStyles}>Coordinate</th>
            <th className={thStyles}>Chapter ID</th>
            <th className={thStyles}>Owner</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 hover:cursor-pointer">
              <td className={tdStyles}>{item.id}</td>
              <td className={tdStyles}>{item.name}</td>
              <td className={tdStyles}>{item.creationDate}</td>
              <td className={tdStyles}>{item.health}</td>
              <td className={tdStyles}>{item.weapon}</td>
              <td className={tdStyles}>{item.meleeWeapon}</td>
              <td className={tdStyles}>
                ({item.coordinates.x}; {item.coordinates.y})
              </td>
              <td className={tdStyles}>{item.chapter.id}</td>
              <td className={tdStyles}>{item.owner.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
