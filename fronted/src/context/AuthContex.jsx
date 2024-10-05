import { createContext, useContext, useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "../api/axios";

export const AuthContext = createContext();

// Para evitar importar 'useConext' y
// 'AuthContext' creamos un hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const signin = async (data) => {
    try {
      const res = await axios.post("/signin", data);
      setUser(res.data);
      setIsAuth(true);

      return res.data;
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }

      setErrors([error.response.data.message]);
    }
  };

  const signup = async (data) => {
    // const response = await fetch("http://localhost:3000/api/signup", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Credentials": true,
    //   },
    // });

    // const dataSignup = await response.json();

    try {
      const res = await axios.post("/signup", data);
      setUser(res.data);
      setIsAuth(true);

      return res.data;
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }

      setErrors([error.response.data.message]);
    }
  };

  const signout = async () => {
    await axios.post("/signout");
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    setLoading(true);

    if (Cookie.get("token")) {
      // get profile
      axios
        .get("/profile")
        .then((res) => {
          setUser(res.data);
          setIsAuth(true);
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
          setIsAuth(false);
        });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const clean = setTimeout(() => {
      setErrors(null);
    }, 5000);

    return () => clearTimeout(clean);
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{ user, isAuth, errors, signup, signin, signout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
