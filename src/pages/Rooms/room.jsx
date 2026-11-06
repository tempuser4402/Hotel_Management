import React from "react";
import { Outlet } from "react-router-dom";

const room = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default room;
