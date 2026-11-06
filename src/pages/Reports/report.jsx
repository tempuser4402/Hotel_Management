import React from "react";
import { Outlet } from "react-router-dom";

const report = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default report;
