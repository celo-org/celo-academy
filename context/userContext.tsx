import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

type UserProviderProps = {
  user: UserProps | null;
  setUser: () => Promise<void>;
  userLoading: boolean;
};

type UserProps = {
  address?: string;
  name?: string;
  email?: string;
  country?: string;
  discord?: string;
};

export const UserContext = createContext<UserProviderProps>({
  user: null,
  setUser: async () => {},
  userLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useUserData();

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext<UserProviderProps>(UserContext);

export const useUserData = () => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  const fetchUser = async () => {
    const res = await fetch("/api/get-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });
    const data = await res.json();
    setUser(data["user"]);
    setUserLoading(false);
  };

  useEffect(() => {
    if (isConnected) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return { user, setUser: fetchUser, userLoading };
};
