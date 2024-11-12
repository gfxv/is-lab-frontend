import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getBaseUrl } from "../../global";
import { Link } from "react-router-dom";


import NewCoordinatesModal from "./NewCoordinatesModal";
import NewChapterModal from "./NewChapterModal";
import CoordinatesTable from "./CoordinatesTable";
import ChapterTable from "./ChapterTable";

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
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [chapter, setChapter] = useState({
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
    setCoordinates({x: info.coordinates.x, y: info.coordinates.y})
    setChapter({
      name: info.chapter.name,
      parentLegion: info.chapter.parentLegion,
      marinesCount: info.chapter.marinesCount,
      world: info.chapter.world,
    })
    setOwner(info.setOwner)

    setIsCoordinateSelected(true)
    setIsChapterSelected(true)
  }

  const handleFormSubmit = (e) => {
    // update new values
    // ? send put request to API ?
  }

  return (
    <div class="w-full max-w-lg m-auto mt-5">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Name:
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="username"
            placeholder="Space Marine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Health:
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={health}
            onChange={(e) => setHealth(e.target.value)}
            min="0"
            required
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Height:
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Weapon:
            </label>
            <select
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              required
            >
              {availableWeapons.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Melee Weapon:
            </label>
            <select
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={meleeWeapon}
              onChange={(e) => setMeleeWeapon(e.target.value)}
              required
            >
              {Object.values(availableMeleeWeapons).map((mw) => (
                <option key={mw} value={mw}>
                  {mw}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Coordinates:
          </label>
          {isCoordinateSelected && (
            <div>
              <label class="block text-gray-700 text-sm font-mono">
                Selected Coordinate:
              </label>
              <label class="block text-gray-700 text-sm font-mono">
                x: {coordinates.x} 
              </label>
              <label class="block text-gray-700 text-sm font-mono mb-2">
                y: {coordinates.y} 
              </label>
            </div>
          )}
          <label class="block text-gray-500 text-sm">Select from table</label>
          <CoordinatesTable onRowClick={onCoordinateSelection}
          />
          <label class="block text-gray-500 text-sm mt-2">
            Or create a new one
          </label>
          <button
            class="rounded-md bg-sky-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-sky-700 focus:shadow-none active:bg-sky-700 hover:bg-sky-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={() => setIsCoordinatesModalOpen(true)}
          >
            New coordinate
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Chapter:
          </label>
          { isChapterSelected && (
            <div>
              <label class="block text-gray-700 text-sm font-mono">
                Selected Chapter:
              </label>
              <label class="block text-gray-700 text-sm font-mono">
                name: {chapter.name} 
              </label>
              <label class="block text-gray-700 text-sm font-mono">
                parent legion: {chapter.parentLegion} 
              </label>
              <label class="block text-gray-700 text-sm font-mono">
                marines count: {chapter.marinesCount} 
              </label>
              <label class="block text-gray-700 text-sm font-mono mb-2">
                world: {chapter.world} 
              </label>
            </div>
          )}
          <label class="block text-gray-500 text-sm">Select from table</label>
          <ChapterTable data={availableChapters} onRowClick={onChapterSelection} />
          <label class="block text-gray-500 text-sm mt-2">
            Or create a new one
          </label>
          <button
            class="rounded-md bg-sky-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-sky-700 focus:shadow-none active:bg-sky-700 hover:bg-sky-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={() => setIsChapterModalOpen(true)}
          >
            New chapter
          </button>
        </div>

        <div class="flex justify-center">
          <button
            onClick={handleFormSubmit}
            class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="submit"
          >
            Save changes
          </button>
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
