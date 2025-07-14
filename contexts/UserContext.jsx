import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  return (
    <UserContext.Provider value={{ loggedInUserId, setLoggedInUserId }}>
      {children}
    </UserContext.Provider>
  );
};
