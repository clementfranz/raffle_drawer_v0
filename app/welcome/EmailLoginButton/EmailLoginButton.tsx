import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/auth/AuthContext";
import useLocalStorageState from "use-local-storage-state";

type EmailLoginButtonProps = {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

function EmailLoginButton({ setErrorMessage }: EmailLoginButtonProps) {
  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCaption, setLoginCaption] = useState("Login with Email");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);

  const [loginDisabled, setLoginDisabled] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const baseAPIURL = import.meta.env.VITE_API_URL_AUTH;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    setIsEmailFilled(!!email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
    setIsPasswordFilled(!!password);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!isEmailFilled || !isPasswordFilled) {
      return;
    }

    if (loginDisabled) {
      return;
    }

    setIsLoggingIn(true);
    setLoginDisabled(true);
    setLoginCaption("Logging in...");

    try {
      const res = await axios.post(baseAPIURL + "/auth/login", {
        email,
        password
      });

      auth?.login(res.data.user, res.data.token);
      setLoginCaption("Login Successful");
      navigate("/main");
    } catch (error: any) {
      console.error("Email login failed:", error);
      const errMessage = error.response?.data?.error;
      const message = "Email or Password don't match any account";

      if (isServerActive) {
        setErrorMessage(message);
      } else {
        setErrorMessage("Something is wrong with the server");
      }

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
  };

  return (
    <div className="form flex-col flex gap-3 items-center justify-center w-full mt-6">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => handleEmailChange(e)}
        onKeyDown={(e) => handleEnterKey(e)}
        className={`bg-white w-[250px] py-2 px-2.5 rounded-xl`}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => handlePasswordChange(e)}
        onKeyDown={(e) => handleEnterKey(e)}
        className={`bg-white w-[250px] py-2 px-2.5 rounded-xl`}
      />
      <button
        onClick={handleLogin}
        type="button"
        className={`text-[white] w-[250px] py-2 px-2.5 rounded-xl ${
          loginDisabled
            ? "cursor-wait bg-emerald-600"
            : "cursor-pointer hover:bg-[#df0429c4] bg-[#df0427]"
        }`}
      >
        <div
          className={`button-content flex gap-2 justify-center items-center ${
            isLoggingIn ? "animate-pulse" : ""
          }`}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <span>{loginCaption}</span>
        </div>
      </button>
    </div>
  );
}

export default EmailLoginButton;
