import React from "react";
import { Outlet } from "react-router-dom";

const restaurant = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default restaurant;
