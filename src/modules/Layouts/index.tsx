import React, { FC, createContext, useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppBar, Box, CssBaseline, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Topbar from "./components/Topbar";
import TypeAhead from "../../components/TypeAhead";
import useRouterData from "../../hooks/useRouterData";
import { RouteData } from "../../types/route.type";

type LayoutProps = {
  children?: any;
};
const defaultTheme = createTheme();
export const SearchContext = createContext(null);

const Layout: FC<LayoutProps> = () => {
  const { searchBar } = useRouterData<RouteData>() || {};
  const [term, setTerm] = useState<any>("");
  const termChanged = useCallback((q: string) => setTerm(q), []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <SearchContext.Provider value={term} >
        <CssBaseline />
        <AppBar position="relative" color="transparent">
          <Container maxWidth="sm">
            <Topbar
              typeAhead={
                <TypeAhead onChanged={termChanged} hidden={!searchBar} />
              }
            />
          </Container>
        </AppBar>
        <main>
          <Container maxWidth="sm" sx={{ height: "100%" }}>
            <Box minHeight={"100%"} minWidth={"100%"} sx={{ py: 3 }}>
              <Outlet />
            </Box>
          </Container>
        </main>
      </SearchContext.Provider>
    </ThemeProvider>
  );
};

export default Layout;
