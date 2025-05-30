import React, { useState } from "react";
import api from "~/api/asClient/axios";
import { useAuth } from "~/auth/AuthContext";

const apiURL = "user/change-password"; // 🔁 Change this later

const Section_ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    try {
      const response = await api.post(
        apiURL,
        {
          current_password: currentPassword,
          new_password: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        setSuccessMessage("Password successfully updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(response.data?.error || "Something went wrong.");
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.error || "Server error. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="px-4 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Change My Password
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-amber-200 bg-gray-100"
              placeholder="Enter current password"
            />
          </div>

          <div className="row-start-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-amber-200 bg-gray-100"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-amber-200 bg-gray-100"
              placeholder="Confirm new password"
            />
          </div>

          <div className="row-start-3 col-span-2 flex justify-end items-end w-full">
            <button
              type="submit"
              className="w-fit mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition px-4"
            >
              Update Password
            </button>
          </div>

          {errorMessage && (
            <div className="col-span-2 text-red-600 text-sm mt-2">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="col-span-2 text-green-600 text-sm mt-2">
              {successMessage}
            </div>
          )}
        </div>
      </section>
    </form>
  );
};

export default Section_ChangePassword;
