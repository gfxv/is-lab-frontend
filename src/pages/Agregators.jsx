import React from "react";
import WeaponTypeGroup from "../components/WeaponTypeGroup";
import HeightCount from "../components/HeightCount";
import Header from "../components/Header";

const Aggregators = () => {

  return (
    <>
      <Header />
      <div className="max-w-5xl m-auto overflow-x-auto">
        <h1 className="text-2xl font-bold mt-6 mb-1">Aggregators Page</h1>
        <div className="mb-4">
          <HeightCount/>
        </div>
        <div className="mb-4">
          <WeaponTypeGroup />
        </div>
      </div>
    </>
  );
};

export default Aggregators;
