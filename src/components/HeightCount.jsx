import React, { useEffect, useState } from "react";
import { getBaseUrl } from "../global";
import axios from "axios";

const HeightCount = () => {
  const [count, setCount] = useState(0);
  const [height, setHeight] = useState("");

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  useEffect(() => {
    setCount(0)

    const config = {
      params: {
        height: parseInt(height),
      }
    }

    console.log(config)

    axios
      .get(getBaseUrl() + "/marines/count-height", config)
      .then((response) => {
        setCount(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [height]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Count by Height</h2>
      <input
            type="number"
            placeholder="Enter height"
            value={height}
            onChange={handleHeightChange}
            className="border border-gray-300 rounded px-2 py-1 mr-2"
          />
      <p>
        Number of objects with height {height}: {count}
      </p>
    </div>
  );
};

export default HeightCount;
