"use client";
import React, { useEffect } from "react";

function page() {
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = await fetch("/api/user");
        const response = await data.json();      
        console.log(response);
      } catch (error) {        
        console.log(error)
      }
    };
    fetchdata();
  }, []);
  return <div>page</div>;
}

export default page;
