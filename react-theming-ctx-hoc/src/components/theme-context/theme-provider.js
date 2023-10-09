import ThemeContext from "./theme-context"
import React, { useState } from "react"
import { useCookies } from "react-cookie"

const ThemeProvider = ({children}) => {

    const PREFFERENCE_THEME_COOKIE = "preffered-theme"
    const DARK_THEME_NAME = "theme-dark"
    const LIGHT_THEME_NAME = "theme-light"

    const [cookieTheme, setCookieTheme] = useCookies([PREFFERENCE_THEME_COOKIE])
    const preferredTheme = cookieTheme && cookieTheme[PREFFERENCE_THEME_COOKIE]
        ? cookieTheme[PREFFERENCE_THEME_COOKIE]
        : DARK_THEME_NAME
    const [theme, setTheme] = useState(preferredTheme);

    const toggleTheme = () => {
        const selectedTheme = theme === DARK_THEME_NAME ? LIGHT_THEME_NAME : DARK_THEME_NAME
        setTheme(selectedTheme)
        setCookieTheme(PREFFERENCE_THEME_COOKIE, selectedTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )

}

export default ThemeProvider