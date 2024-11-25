import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "../../global";

import NewCoordinatesModal from "./NewCoordinatesModal";
import NewChapterModal from "./NewChapterModal";
import CoordinatesTable from "./CoordinatesTable";
import ChapterTable from "./ChapterTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const SpaceMarineCard = ({ id }) => {
  const [availableWeapons, setAvailableWeapons] = useState([]);
  const [availableMeleeWeapons, setAvailableMeleeWeapons] = useState([]);
  const [availableCoordinates, setAvailableCoordinates] = useState([]);
  const [availableChapters, setAvailableCapters] = useState([]);

  const [name, setName] = useState("");
  const [creationDate, setCreationDate] = useState(0);
  const [health, setHealth] = useState(100);
  const [height, setHeight] = useState(100);
  const [weapon, setWeapon] = useState("");
  const [meleeWeapon, setMeleeWeapon] = useState("");
  const [coordinates, setCoordinates] = useState({ id: -1, x: 0, y: 0 });
  const [chapter, setChapter] = useState({
    id: -1,
    name: "",
    parentLegion: "",
    marinesCount: 1,
    world: "",
  });
  const [owner, setOwner] = useState("");

  const [isCoordinatesModalOpen, setIsCoordinatesModalOpen] = useState(false);
  const [isChaptersModalOpen, setIsChapterModalOpen] = useState(false);

  const [isCoordinateSelected, setIsCoordinateSelected] = useState(false);
  const [isChapterSelected, setIsChapterSelected] = useState(false);

  const [canEdit, setCanEdit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };
  const navigate = useNavigate();

  const handleDelete = () => {
    axios
      .delete(`${getBaseUrl()}/marines/${id}`, config)
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error occurred while deleting item:", error);
      });
  };

  const onCoordinateSelection = (newCoordinate) => {
    setCoordinates(newCoordinate);
    setIsCoordinateSelected(true);
  };

  const onChapterSelection = (newChapter) => {
    setChapter(newChapter);
    setIsChapterSelected(true);
  };

  useEffect(() => {
    axios
      .get(getBaseUrl() + `/marines/has-access/${id}`, config)
      .then((response) => {
        setCanEdit(response.data);
        setIsEditMode(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    axios
      .get(getBaseUrl() + `/marines/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    axios
      .get(getBaseUrl() + "/marines/weapons")
      .then((response) => {
        setAvailableWeapons(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    axios
      .get(getBaseUrl() + "/marines/melee-weapons")
      .then((response) => {
        setAvailableMeleeWeapons(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const setData = (info) => {
    setName(info.name);
    setCreationDate(info.creationDate);
    setHealth(info.health);
    setHeight(info.height);
    setWeapon(info.weapon);
    setMeleeWeapon(info.meleeWeapon);
    setCoordinates({
      id: info.coordinates.id,
      x: info.coordinates.x,
      y: info.coordinates.y,
    });
    setChapter({
      id: info.chapter.id,
      name: info.chapter.name,
      parentLegion: info.chapter.parentLegion,
      marinesCount: info.chapter.marinesCount,
      world: info.chapter.world,
    });
    setOwner(info.setOwner);

    setIsCoordinateSelected(true);
    setIsChapterSelected(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const updatedMarine = {
      id: parseInt(id),
      name: name,
      creationDate: creationDate,
      health: health,
      height: height,
      weapon: weapon,
      meleeWeapon: meleeWeapon,
      coordinates: coordinates,
      chapter: chapter,
    };

    console.log(updatedMarine);

    axios
      .put(`${getBaseUrl()}/marines`, updatedMarine, config)
      .then((response) => {
        console.log("Space Marine updated successfully: ", response.status);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="w-full max-w-lg m-auto mt-5 relative">
      {canEdit && (
        <div className="absolute top-1 right-1">
          <button
            onClick={handleDelete}
            className=" bg-red-500 text-white px-2 py-1 rounded shadow-lg hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="username"
            placeholder="Space Marine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={!isEditMode}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Health:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={health}
            onChange={(e) => setHealth(e.target.value)}
            min="0"
            readOnly={!isEditMode}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Height:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="0"
            readOnly={!isEditMode}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Weapon:
            </label>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              disabled={!canEdit}
            >
              {availableWeapons.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Melee Weapon:
            </label>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={meleeWeapon}
              onChange={(e) => setMeleeWeapon(e.target.value)}
              disabled={!canEdit}
            >
              {Object.values(availableMeleeWeapons).map((mw) => (
                <option key={mw} value={mw}>
                  {mw}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Coordinates:
          </label>
          {isCoordinateSelected && (
            <div>
              <label className="block text-gray-700 text-sm font-mono">
                Selected Coordinate:
              </label>
              <label className="block text-gray-700 text-sm font-mono">
                x: {coordinates.x}
              </label>
              <label className="block text-gray-700 text-sm font-mono mb-2">
                y: {coordinates.y}
              </label>
            </div>
          )}

          {canEdit && (
            <>
              <label className="block text-gray-500 text-sm">
                Select from table
              </label>
              <CoordinatesTable onRowClick={onCoordinateSelection} />
              <label className="block text-gray-500 text-sm mt-2">
                Or create a new one
              </label>
              <button
                className="rounded-md bg-sky-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-sky-700 focus:shadow-none active:bg-sky-700 hover:bg-sky-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={() => setIsCoordinatesModalOpen(true)}
              >
                New coordinate
              </button>
            </>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Chapter:
          </label>
          {isChapterSelected && (
            <div>
              <label className="block text-gray-700 text-sm font-mono">
                Selected Chapter:
              </label>
              <label className="block text-gray-700 text-sm font-mono">
                name: {chapter.name}
              </label>
              <label className="block text-gray-700 text-sm font-mono">
                parent legion: {chapter.parentLegion}
              </label>
              <label className="block text-gray-700 text-sm font-mono">
                marines count: {chapter.marinesCount}
              </label>
              <label className="block text-gray-700 text-sm font-mono mb-2">
                world: {chapter.world}
              </label>
            </div>
          )}

          {canEdit && (
            <>
              <label className="block text-gray-500 text-sm">
                Select from table
              </label>
              <ChapterTable
                data={availableChapters}
                onRowClick={onChapterSelection}
              />
              <label className="block text-gray-500 text-sm mt-2">
                Or create a new one
              </label>
              <button
                className="rounded-md bg-sky-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-sky-700 focus:shadow-none active:bg-sky-700 hover:bg-sky-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={() => setIsChapterModalOpen(true)}
              >
                New chapter
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center">
          {canEdit ? (
            <button
              onClick={handleFormSubmit}
              className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="submit"
            >
              Save changes
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/")}
                className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="submit"
              >
                Go Back
              </button>
            </>
          )}
        </div>
      </div>

      <NewCoordinatesModal
        isOpen={isCoordinatesModalOpen}
        onClose={() => setIsCoordinatesModalOpen(false)}
        onSave={(newCoordinates) => setCoordinates(newCoordinates)}
      />

      <NewChapterModal
        isOpen={isChaptersModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onSave={(newChapter) => setChapter(newChapter)}
      />
    </div>
  );
};

export default SpaceMarineCard;
