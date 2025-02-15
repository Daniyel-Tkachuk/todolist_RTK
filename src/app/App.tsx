import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import React from "react"
import { Header } from "common/components"
import { useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectThemeMode } from "./appSelectors"
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar"
import { Routing } from "common/routing"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Header />
      <Routing />
      <ErrorSnackbar />
    </ThemeProvider>
  )
}
