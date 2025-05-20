import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router";

function GoogleLoginButton() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      const res = await axios.post(
        "http://localhost:8000/api/auth/google/callback",
        {
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture
        }
      );

      console.log("Server response:", res.data);
      navigate("/main");
    },
    onError: (error) => {
      console.error("Google Login Error", error);
    }
  });

  return (
    <button
      onClick={() => login()}
      type="button"
      className="bg-[#7e061a] hover:bg-[#7e061acb] text-white w-[250px] py-2 px-2.5 rounded-xl cursor-pointer gap-3 flex justify-center items-center"
    >
      <FontAwesomeIcon icon={faGoogle} />
      <span>Login with Google</span>
    </button>
  );
}

export default GoogleLoginButton;
