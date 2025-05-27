import React from "react";

const Tab03_SystemUpdates = () => {
  return (
    <div>
      <span className="text-2xl font-bold">
        {" "}
        ⭕🔴⭕ PLEASE READ LATEST UPDATES ⭕🔴⭕
      </span>
      <div className="progress-bar my-4 w-full bg-gray-700 h-[50px] rounded-full p-2">
        <div className="progress-fill bg-emerald-500 w-[33%] h-full rounded-full flex justify-center items-center animate-pulse">
          33%
        </div>
      </div>
      <h1>New Fixes</h1>
      <ul className="ml-4 mb-4">
        <li>⭐ User Authentication to Prevent Unautorized Access on Cloud</li>
        <li>⭐ Restructured Header Buttons</li>
      </ul>
      <h1>Work In Progress (Remaining Issues Only)</h1>
      <ul className=" ml-4">
        <li>
          🔴 Conflicting Bugs for Winners Downsync Controllers (API Structure
          Issue){" "}
        </li>
        <li>
          🔴 Enabling of API Access on CPanel Deployment (Restructuring
          in-progress)
        </li>
        <li>⏳ Pagination Issues</li>
        <li>⏹️ White Listing of Email Accounts</li>
      </ul>

      <div className="mt-4 text-sm">
        <p>Legend:</p>
        <div className="flex gap-4 flex-wrap">
          <span>⏹️ Not Started Yet</span>
          <span>⏳ Work In Progress</span>
          <span>🔴 Fixing Problem</span>
          <span>✅ Feature Done</span>
          <span>⭐ New Feature</span>
        </div>
      </div>
      <h1 className="text-emerald-900 mt-5">
        Estimated Time of Completion:{" "}
        <b className=" animate-pulse">
          5:00 PM - 2025-05-21 (Today) [add 1 hour allowance]
        </b>
      </h1>
    </div>
  );
};

export default Tab03_SystemUpdates;
