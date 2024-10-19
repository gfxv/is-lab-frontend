// SpaceMarineForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewCoordinatesModal from "./NewCoordinatesModal";
import NewChapterModal from "./NewChapterModal";
import CoordinatesTable from "./CoordinatesTable";
import ChapterTable from "./ChapterTable";

import axios from "axios";
import { getBaseUrl } from "../../global";

const SpaceMarineForm = () => {
  const [availableWeapons, setAvailableWeapons] = useState([]);
  const [availableMeleeWeapons, setAvailableMeleeWeapons] = useState([]);
  const [availableCoordinates, setAvailableCoordinates] = useState([]);
  const [availableChapters, setAvailableCapters] = useState([]);

  const [name, setName] = useState("");
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

  const [isCoordinatesModalOpen, setIsCoordinatesModalOpen] = useState(false);
  const [isChaptersModalOpen, setIsChapterModalOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newSpaceMarine = {
      name,
      creationDate: "", // NOTE: generate creationDate on server side
      health,
      height,
      weapon,
      meleeWeapon,
      coordinates,
      chapter,
    };

    console.log("New Space Marine:", newSpaceMarine);
    console.log(config);

    axios
      .post(getBaseUrl() + "/marines/new", newSpaceMarine, config)
      .then((response) => {
        console.log(`[${response.status}] ${response.data}`);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
              <option>...</option>
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
              <option>...</option>
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
          <label class="block text-gray-500 text-sm">Select from table</label>
          <CoordinatesTable
            data={availableCoordinates}
            onRowClick={setCoordinates}
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
          <label class="block text-gray-500 text-sm">Select from table</label>
          <ChapterTable data={availableChapters} onRowClick={setChapter} />

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
            Create new space marine
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

export default SpaceMarineForm;
