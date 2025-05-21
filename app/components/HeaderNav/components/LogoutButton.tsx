import { useAuth } from "~/auth/AuthContext";
import { useNavigate } from "react-router";

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home or login page
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
