import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getBaseUrl, getWsBaseUrl } from "../global";
import { Link } from "react-router-dom";

import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const wsUrl = getWsBaseUrl();
  const stompClientRef = useRef(null);

  const getRecords = () => {
    axios
      .get(getBaseUrl() + "/marines", {
        params: {
          page: 0,
          size: 5,
        },
      })
      .then((response) => {
        updateTable(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    stompClientRef.current = Stomp.over(() => new SockJS(wsUrl));

    stompClientRef.current.connect({}, (frame) => {
      console.log("Connected to WebSocket: " + frame);
      stompClientRef.current.subscribe("/records/changes", (message) => {
        console.log("[ws.subscribe]", message.body);
        updateTable(JSON.parse(message.body));
      });

      console.log("calling getRecords()");
      getRecords();
    });

    stompClientRef.current.debug = (str) => {
      console.log("WS Debug:", str);
    };

    stompClientRef.current.activate();
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("Disconnected");
        });
      }
    };
  }, []);

  const updateTable = (message) => {
    switch (message.type) {
      case "GET":
        setData(message.records);
        break;
      case "ADD":
        setData((prevData) => [...prevData, message.records]);
        break;
      case "UPDATE":
        setData((prevData) =>
          prevData.map((item) =>
            item.id === message.records[0].id ? message.records[0] : item
          )
        );
        break;
      case "DELETE":
        setData((prevData) =>
          prevData.filter((item) => item.id !== message.records[0].id)
        );
        break;
      default:
        break;
    }
  };

  const thStyles = "py-1 px-1 border-b";
  const tdStyles = "py-2 px-2 border-b text-center";

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
