import React, { useEffect, useState } from "react";

import axios from "axios";
import { getBaseUrl } from "../global";

const WeaponTypeGroup = () => {

  const [data, setData] = useState({});
  const weaponTypes = Object.keys(data);

  useEffect(() => {
    axios
      .get(getBaseUrl() + "/marines/by-weapon")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Grouped by Weapon Type</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-300 sticky top-0 z-10">
          <tr>
            {weaponTypes.map((weaponType) => (
              <th key={weaponType} className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                {weaponType} ({data[weaponType].length})
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: Math.max(...Object.values(data).map(arr => arr.length)) }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {weaponTypes.map((weaponType) => (
                <td key={weaponType} className="px-2 py-1 text-sm text-gray-600">
                  {data[weaponType][rowIndex] ? data[weaponType][rowIndex].name : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeaponTypeGroup;
