import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/auth/AuthContext";

type GoogleLoginButtonProps = {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

function GoogleLoginButton({ setErrorMessage }: GoogleLoginButtonProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginCaption, setLoginCaption] = useState("Login with Google");

  const [loginDisabled, setLoginDisabled] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth(); // use AuthContext

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoginCaption("Authenticating...");
        const { access_token } = tokenResponse;

        const baseAPIURL = import.meta.env.VITE_API_URL_AUTH;

        // Step 1: Get user info from Google
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        );

        // Step 2: Send to your Laravel backend
        const res = await axios.post(baseAPIURL + "/auth/google/callback", {
          email: userInfo.data.email,
          first_name: userInfo.data.given_name,
          last_name: userInfo.data.family_name,
          sub: userInfo.data.sub,
          picture: userInfo.data.picture
        });

        // Step 3: Use AuthContext to set auth
        auth?.login(res.data.user, res.data.token);

        // Done!
        setLoginCaption("Login Successful ✅");
        navigate("/main");
      } catch (error: any) {
        console.error("Login error:", error);
        const message =
          error.response?.data?.error ||
          "Email or Password don't match any account";

        setErrorMessage(message);

        let countdown = 10;

        // Show the first message immediately
        setLoginCaption(`Try Again in ${countdown} seconds`);

        const tryAgainTimer = setInterval(() => {
          countdown--;
          if (countdown > 0) {
            setLoginCaption(`Try Again in ${countdown} seconds`);
          } else {
            clearInterval(tryAgainTimer);
          }
        }, 1000);

        const destroyMessage = setTimeout(() => {
          setLoginDisabled(false);
          setLoginCaption("Login with Email");
          setErrorMessage("");
          clearTimeout(destroyMessage);
        }, 10000);
      } finally {
        setIsLoggingIn(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error", error);
      setLoginCaption("Something went wrong ❌");
      setIsLoggingIn(false);
    }
  });

  const triggerLogin = () => {
    setIsLoggingIn(true);
    setLoginCaption("Logging in...");
    login(); // keep using this trigger
  };

  return (
    <button
      onClick={triggerLogin}
      type="button"
      className="bg-[#7e061a] hover:bg-[#7e061acb] text-white w-[250px] py-2 px-2.5 rounded-xl cursor-pointer gap-3 flex justify-center items-center"
    >
      <div
        className={`button-content flex gap-2 justify-center items-center ${
          isLoggingIn ? "animate-pulse" : ""
        }`}
      >
        <FontAwesomeIcon icon={faGoogle} />
        <span>{loginCaption}</span>
      </div>
    </button>
  );
}

export default GoogleLoginButton;
