import "./main-page.scss"
import React from "react"
import { useContext } from "react"
import Button from "../button/button"
import ThemeContext from "../theme-context/theme-context"

const MainPage = (props) => {

    const { theme, toggleTheme } = useContext(ThemeContext)

    return (
        <div className={`app ${theme}`}>
            <h1>MainPage</h1>
            <Button onClick={toggleTheme}>Toggle theme</Button>
            <Button onClick={() => alert("Hello! I'm alert!")}>Alert button</Button>
        </div>
    )

}

export default MainPage