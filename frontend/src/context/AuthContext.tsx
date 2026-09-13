import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api-communicator";

type User = {
  name: string;
  email: string;
};

type UserAuth = {
  isLoggedIn: boolean;
  isLoadingUser: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    // On first load, see if an existing auth cookie is still valid so the
    // user doesn't have to log in again every visit.
    (async () => {
      const data = await checkAuthStatus();
      if (data) {
        setUser({ email: data.email, name: data.name });
        setIsLoggedIn(true);
      }
      setIsLoadingUser(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setUser({ email: data.email, name: data.name });
    setIsLoggedIn(true);
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await signupUser(name, email, password);
    setUser({ email: data.email, name: data.name });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
  };

  const value: UserAuth = {
    user,
    isLoggedIn,
    isLoadingUser,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
