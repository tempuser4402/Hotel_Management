import React from "react";
import { Outlet } from "react-router-dom";

const maintenance = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default maintenance;
