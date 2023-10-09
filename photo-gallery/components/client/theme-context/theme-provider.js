import ThemeContext from "./theme-context"
import React, { useEffect, useState } from "react"
import { useCookies } from "react-cookie"

const ThemeProvider = ({children}) => {

    const PREFFERENCE_THEME_COOKIE = "preffered-theme"
    const DARK_THEME_NAME = "dark"
    const LIGHT_THEME_NAME = "light"

    const [cookieTheme, setCookieTheme] = useCookies([PREFFERENCE_THEME_COOKIE])
    const preferredTheme = cookieTheme && cookieTheme[PREFFERENCE_THEME_COOKIE]
        ? cookieTheme[PREFFERENCE_THEME_COOKIE]
        : DARK_THEME_NAME
    const [theme, setTheme] = useState(DARK_THEME_NAME)

    useEffect(() => setTheme(preferredTheme), [])

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