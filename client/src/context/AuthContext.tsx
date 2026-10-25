import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiRequest,
  TOKEN_STORAGE_KEY,
} from "../lib/api/api";

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface RegisterPayload {
  full_name: string;
  email: string;
  organization_id: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    payload: LoginPayload,
  ) => Promise<User>;
  register: (
    payload: RegisterPayload,
  ) => Promise<User | null>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

function saveToken(token: string): void {
  sessionStorage.setItem(
    TOKEN_STORAGE_KEY,
    token,
  );
}

function getStoredToken(): string | null {
  return sessionStorage.getItem(
    TOKEN_STORAGE_KEY,
  );
}

function clearToken(): void {
  sessionStorage.removeItem(
    TOKEN_STORAGE_KEY,
  );
}

async function fetchCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

async function authenticateWithToken(
  response: AuthResponse,
): Promise<User> {
  saveToken(response.access_token);

  try {
    const currentUser =
      await fetchCurrentUser();

    return currentUser;
  } catch (error) {
    clearToken();
    throw error;
  }
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(
      getStoredToken(),
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser =
    useCallback(async (): Promise<
      User | null
    > => {
      const storedToken =
        getStoredToken();

      if (!storedToken) {
        setToken(null);
        setUser(null);
        return null;
      }

      try {
        const currentUser =
          await fetchCurrentUser();

        setToken(storedToken);
        setUser(currentUser);

        return currentUser;
      } catch {
        clearToken();
        setToken(null);
        setUser(null);

        return null;
      }
    }, []);

  const login = useCallback(
    async (
      payload: LoginPayload,
    ): Promise<User> => {
      const response =
        await apiRequest<AuthResponse>(
          "/auth/login",
          {
            method: "POST",
            body: JSON.stringify(
              payload,
            ),
            skipAuth: true,
          },
        );

      const currentUser =
        await authenticateWithToken(
          response,
        );

      setToken(response.access_token);
      setUser(currentUser);

      return currentUser;
    },
    [],
  );

  const register = useCallback(
    async (
      payload: RegisterPayload,
    ): Promise<User | null> => {
      const response =
        await apiRequest<
          AuthResponse | User
        >("/auth/register", {
          method: "POST",
          body: JSON.stringify(
            payload,
          ),
          skipAuth: true,
        });

      if (
        typeof response === "object" &&
        response !== null &&
        "access_token" in response
      ) {
        const authResponse =
          response as AuthResponse;

        const currentUser =
          await authenticateWithToken(
            authResponse,
          );

        setToken(
          authResponse.access_token,
        );
        setUser(currentUser);

        return currentUser;
      }

      return null;
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const storedToken =
        getStoredToken();

      if (!storedToken) {
        if (mounted) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const currentUser =
          await fetchCurrentUser();

        if (!mounted) {
          return;
        }

        setToken(storedToken);
        setUser(currentUser);
      } catch {
        if (!mounted) {
          return;
        }

        clearToken();
        setToken(null);
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized =
      () => {
        logout();
      };

    window.addEventListener(
      "lexmind:unauthorized",
      handleUnauthorized,
    );

    return () => {
      window.removeEventListener(
        "lexmind:unauthorized",
        handleUnauthorized,
      );
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated:
        Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// This hook intentionally shares the provider module's private context.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}
