import { createContext } from "react"

const ThemeContext = createContext({
    theme: null,
    toggleTheme: () => {}
})

export default ThemeContext