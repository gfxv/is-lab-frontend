import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getBaseUrl, getWsBaseUrl } from "../global";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const stompClientRef = useRef(null);
  const wsUrl = getWsBaseUrl();

  const pageMinValue = 0;
  const [pageMaxValue, setPageMaxValue] = useState(0); // ???
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(pageMinValue);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const getRecords = (page) => {
    console.log("triggered get records: " + currentPage);
    console.log("min: " + pageMinValue);
    console.log("max: " + pageMaxValue);

    axios
      .get(getBaseUrl() + "/marines", {
        params: {
          page: page,
          size: pageSize,
        },
      })
      .then((response) => {
        updateTable(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getPagesCount = () => {
    axios
      .get(getBaseUrl() + "/marines/count")
      .then((response) => {
        setPageMaxValue(Math.ceil(response.data / pageSize) - 1);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleRowClick = (id) => {
    navigate(`/marines/${id}`);
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    if (newPage !== pageMinValue) {
      setIsFirst(false);
    }
    if (newPage === pageMaxValue) {
      setIsLast(true);
    }
    if (newPage > pageMaxValue) {
      return;
    }
    getRecords(newPage);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    const newPage = currentPage - 1;
    if (newPage !== pageMaxValue) {
      setIsLast(false);
    }
    if (newPage === pageMinValue) {
      setIsFirst(true);
    }
    if (newPage < pageMinValue) {
      return;
    }
    getRecords(newPage);
    setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    stompClientRef.current = Stomp.over(() => new SockJS(wsUrl));
    stompClientRef.current.connect({}, (frame) => {
      console.log("Connected to WebSocket: " + frame);
      stompClientRef.current.subscribe("/records/changes", (message) => {
        updateTable(JSON.parse(message.body));
      });

      console.log("calling getRecords()");
      getRecords(pageMinValue);
    });

    stompClientRef.current.debug = (str) => {
      console.log("WS Debug:", str);
    };

    stompClientRef.current.activate();
    getPagesCount();
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
            <th className={thStyles}>Height</th>
            <th className={thStyles}>Weapon</th>
            <th className={thStyles}>Melee Weapon</th>
            <th className={thStyles}>Coordinate</th>
            <th className={thStyles}>Chapter ID</th>
            <th className={thStyles}>Owner</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 hover:cursor-pointer"
              onClick={() => handleRowClick(item.id)}
            >
              <td className={tdStyles}>{item.id}</td>
              <td className={tdStyles}>{item.name}</td>
              <td className={tdStyles}>{item.creationDate}</td>
              <td className={tdStyles}>{item.health}</td>
              <td className={tdStyles}>{item.height}</td>
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
      <div className="flex justify-end mt-3">
        <button
          onClick={handlePrevPage}
          disabled={isFirst}
          className={`px-2 border rounded border-gray-400 mr-2 ${
            isFirst ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span>
          {currentPage + 1}/{pageMaxValue + 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={isLast}
          className={`px-2 border border-gray-400 rounded ml-2 ${
            isLast ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
