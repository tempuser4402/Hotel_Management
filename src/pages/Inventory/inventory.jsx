import React from "react";
import { Outlet } from "react-router-dom";

const inventory = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default inventory;
