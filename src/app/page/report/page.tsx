"use client"
import React, { useState } from "react";
import Pivottable from "../../components/PivotTable";
import PivotChart from "../../components/PivotChart";

function page() {
  const [isSlid, setIsSlid] = useState(false);

  const handleToggleSlide = () => {
    setIsSlid(!isSlid); // Toggle the sliding state
  };
  const [togglebtn, settoggle] = useState(true);
  return (
    <div className="w-full bg-white border-gray-400 border rounded-t-lg overflow-x-hidden">
      <h1 className="text-xl bg-red-400 text-white p-2 font-bold rounded-t-md">
        Listing
      </h1>

      <div className="w-full flex justify-center p-2 cursor-pointer select-none">
        <div className="w-1/3  bg-black text-white flex justify-around rounded-full relative h-8">
          <div
            className={`absolute w-1/2 bg-white h-full top-0 rounded-full border-black border transition-all duration-300 ${
              togglebtn ? "left-0" : "left-[50%]"
            }`}
          />
          <div
            className="z-10 mix-blend-difference w-full h-full flex justify-center items-center"
            onClick={() => {
              // window.location.reload(); //temp approch
              settoggle(true);
            }}
          >
            <p>Table</p>
          </div>
          <div
            className="z-10 mix-blend-difference w-full h-full flex justify-center items-center"
            onClick={() => {
              settoggle(false);
            }}
          >
            <p>Chart</p>
          </div>
        </div>
      </div>

      <div className="w-[200%] overflow-hidden flex">
        {/* Sliding wrapper */}
        <div
          className={`w-[100%] flex transition-all duration-500 ease-in-out ${
            togglebtn ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ transitionProperty: "transform" }}
        >
          <div className="w-full h-full">
            <Pivottable />
          </div>
        </div>
        <div
          className={`w-[100%] flex transition-all duration-500 ease-in-out ${
            togglebtn ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ transitionProperty: "transform" }}
        >
          <div className="w-full h-full">
            <PivotChart />
          </div>
        </div>

        {/* Button or div to trigger sliding */}
      </div>
    </div>
  );
}

export default page;
