import React from "react";
import { Outlet } from "react-router-dom";

const housekeeping = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default housekeeping;
