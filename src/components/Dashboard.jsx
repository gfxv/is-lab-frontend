import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getBaseUrl, getWsBaseUrl } from "../global";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faX,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import BaseModal from "./BaseModal";
import ChapterManagerModal from "./domain/ChapterManagerModal";
import CoordinatesManagerModal from "./domain/CoordinatesManagerModal";
import ToggleManagerModal from "./ToggleManagerMadal";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const stompClientRef = useRef(null);
  const wsUrl = getWsBaseUrl();

  const proccessingMessage = "Proccessing...";
  const successMessage = "Object deleted successfully";
  const permissionDeniedMessage = "Permission Denied!";
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isChapterManagerModalOpen, setIsChapterManagerModalOpen] =
    useState(false);
  const openChapterManagerModal = () => setIsChapterManagerModalOpen(true);
  const closeChapterManagerModal = () => setIsChapterManagerModalOpen(false);

  const [isCoordinateManagerModalOpen, setIsCoordinateManagerModalOpen] =
    useState(false);
  const openCoordinateManagerModal = () =>
    setIsCoordinateManagerModalOpen(true);
  const closeCoordinateManagerModal = () =>
    setIsCoordinateManagerModalOpen(false);

  const [isAgregateModalOpen, setIsAgregateModalOpen] = useState(false);
  const openAgregateModal = () => setIsAgregateModalOpen(true);
  const closeAgregateModal = () => setIsAgregateModalOpen(false);

  const pageMinValue = 0;
  const [pageMaxValue, setPageMaxValue] = useState(0);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(pageMinValue);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterColumn, setFilterColumn] = useState("id");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const getRecords = (page) => {
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

  const handleDelete = (id) => {
    setModalMessage(proccessingMessage);
    setIsModalOpen(true);

    axios
      .delete(`${getBaseUrl()}/marines/${id}`, config)
      .then((response) => {
        if (response.status === 200) {
          setModalMessage(successMessage);
          setData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        setModalMessage(error.response.data);
        console.error("Error occurred while deleting item:", error);
      });
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
      stompClientRef.current.subscribe("/records/changes", (message) => {
        updateTable(JSON.parse(message.body));
      });
      getRecords(pageMinValue);
    });

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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterColumnChange = (e) => {
    setFilterColumn(e.target.value);
  };

  const getNestedValue = (item, column) => {
    return column
      .split(".")
      .reduce(
        (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : null),
        item
      );
  };

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    const columnValue = getNestedValue(item, filterColumn);
    return String(columnValue) === searchQuery;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = getNestedValue(a, sortColumn);
    const bValue = getNestedValue(b, sortColumn);
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const thStyles = "py-1 px-1 border-b cursor-pointer";
  const tdStyles = "py-2 px-2 border-b text-center";

  return (
    <div className="max-w-5xl m-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mt-6 mb-1">Space Marine Dashboard</h1>
      <div className="flex justify-between mb-3">
        <div className="flex space-x-2">
          <ToggleManagerModal
            text="Manage Chapters"
            openModal={openChapterManagerModal}
            color="bg-orange-500"
            hoverColor="bg-orange-600"
          />
          <ToggleManagerModal
            text="Manage Coordinates"
            openModal={openCoordinateManagerModal}
            color="bg-purple-500"
            hoverColor="bg-purple-600"
          />
          <Link
            to="/aggregated"
            className="rounded-md bg-teal-500 py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:shadow-none hover:bg-teal-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Agregators
          </Link>
          {/* <ToggleManagerModal
            text="Agregators"
            openModal={openAgregateModal}
            color="bg-teal-500"
            hoverColor="bg-teal-600"
          /> */}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <select
            value={filterColumn}
            onChange={handleFilterColumnChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="creationDate">Creation Date</option>
            <option value="health">Health</option>
            <option value="height">Height</option>
            <option value="weapon">Weapon</option>
            <option value="meleeWeapon">Melee Weapon</option>
            <option value="coordinates">Coordinate</option>
            <option value="chapter.id">Chapter ID</option>
            <option value="owner.username">Owner</option>
          </select>
          <Link
            className="rounded-md bg-sky-600 py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-sky-700 focus:shadow-none active:bg-sky-700 hover:bg-sky-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            to={"/marines/new"}
          >
            New Space Marine
          </Link>
        </div>
      </div>
      <table className="min-w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className={thStyles} onClick={() => handleSort("id")}>
              ID{" "}
              {sortColumn === "id" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("name")}>
              Name{" "}
              {sortColumn === "name" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("creationDate")}>
              Creation Date{" "}
              {sortColumn === "creationDate" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("health")}>
              Health{" "}
              {sortColumn === "health" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("height")}>
              Height{" "}
              {sortColumn === "height" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("weapon")}>
              Weapon{" "}
              {sortColumn === "weapon" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("meleeWeapon")}>
              Melee Weapon{" "}
              {sortColumn === "meleeWeapon" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("coordinates")}>
              Coordinate{" "}
              {sortColumn === "coordinates" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles} onClick={() => handleSort("chapter.id")}>
              Chapter ID{" "}
              {sortColumn === "chapter.id" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th
              className={thStyles}
              onClick={() => handleSort("owner.username")}
            >
              Owner{" "}
              {sortColumn === "owner.username" &&
                (sortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </th>
            <th className={thStyles}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
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
              <td className={tdStyles}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faX} className="px-1" />
                </button>
              </td>
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

      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
      />

      <ChapterManagerModal
        isOpen={isChapterManagerModalOpen}
        onClose={closeChapterManagerModal}
      />
      <CoordinatesManagerModal
        isOpen={isCoordinateManagerModalOpen}
        onClose={closeCoordinateManagerModal}
      />
    </div>
  );
};

export default Dashboard;
