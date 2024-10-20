import React, { useState, useEffect } from "react";

import { getBaseUrl } from "../../global";
import axios from "axios";

const ChapterTable = ({ onRowClick }) => {
  const [data, setData] = useState([])

  const handleSelection = (item) => {
    onRowClick(item);
  };

  useEffect(() => {
    axios
      .get(getBaseUrl() + "/chapters")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="max-h-72 overflow-y-auto border border-gray-300">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-300 sticky top-0 z-10">
          <tr>
            <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
              ID
            </th>
            <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
              Parent Legion
            </th>
            <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
              Marines Count
            </th>
            <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
              World
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-100 cursor-pointer transition-colors duration-200`}
              onClick={() => handleSelection(item)}
            >
              <td className="px-2 py-1 text-sm text-gray-600">{item.id}</td>
              <td className="px-2 py-1 text-sm text-gray-600">{item.name}</td>
              <td className="px-2 py-1 text-sm text-gray-600">
                {item.parentLegion}
              </td>
              <td className="px-2 py-1 text-sm text-gray-600">
                {item.marinesCount}
              </td>
              <td className="px-2 py-1 text-sm text-gray-600">{item.world}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChapterTable;
