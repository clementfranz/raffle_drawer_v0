import { useAuth } from "~/auth/AuthContext";
import { useNavigate } from "react-router";
import { logUserAction } from "~/api/asClient/system/logUserAction";

function LogoutButton() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home or login page
    logUserAction(user?.email || "user@noemail.com", "logout", {
      source: "Logout",
      result: "success"
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 hover:bg-[#7d0b1c] rounded-full cursor-pointer"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
