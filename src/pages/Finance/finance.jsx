import React from "react";
import { Outlet } from "react-router-dom";

const finance = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default finance;
