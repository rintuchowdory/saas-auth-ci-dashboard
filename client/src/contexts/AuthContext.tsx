/**
 * AuthContext — JWT-based authentication state management
 * Design: Slate Precision — dark SaaS dashboard
 *
 * In production this would call the FastAPI backend at /api/auth/login
 * and /api/auth/me. For the static demo we use mock data + localStorage.
 */
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "developer" | "viewer";
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Mock JWT token (in production: received from FastAPI /api/auth/login)
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEiLCJlbWFpbCI6ImRldi5kZW1vQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjo5OTk5OTk5OTk5fQ.demo";

const MOCK_USERS: Record<string, User> = {
  "dev.demo@example.com": {
    id: "user_1",
    email: "dev.demo@example.com",
    name: "Alex Developer",
    role: "admin",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=AD&backgroundColor=6366f1&textColor=ffffff",
  },
  "viewer@example.com": {
    id: "user_2",
    email: "viewer@example.com",
    name: "Sam Viewer",
    role: "viewer",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SV&backgroundColor=8b5cf6&textColor=ffffff",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setState({ user, token: storedToken, isLoading: false, isAuthenticated: true });
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate API call latency
    await new Promise(r => setTimeout(r, 800));

    const user = MOCK_USERS[email.toLowerCase()];
    if (!user) {
      throw new Error("Invalid credentials. Try dev.demo@example.com / any password");
    }

    localStorage.setItem("auth_token", MOCK_TOKEN);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setState({ user, token: MOCK_TOKEN, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 1000));
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: "developer",
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name.slice(0, 2).toUpperCase()}&backgroundColor=6366f1&textColor=ffffff`,
    };
    localStorage.setItem("auth_token", MOCK_TOKEN);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setState({ user: newUser, token: MOCK_TOKEN, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
