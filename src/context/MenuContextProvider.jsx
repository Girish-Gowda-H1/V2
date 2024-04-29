import { createContext, useContext, useMemo, useState } from 'react';

const MenuContext = createContext();

const initialState = {
  drawerOpen: false,
  currentItem: 'dashboard',
};

export const MenuContextProvider = ({ children }) => {
  const [drawerState, setDrawerState] = useState(initialState);

  const contextValues = useMemo(
    () => ({
      drawerState,
      setDrawerState,
    }),
    [drawerState]
  );

  return <MenuContext.Provider value={contextValues}>{children}</MenuContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMenuContext = () => {
  return useContext(MenuContext);
};

export default MenuContext;
