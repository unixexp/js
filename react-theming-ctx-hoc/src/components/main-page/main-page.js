import "./main-page.scss"
import React from "react"
import Button from "../button/button"
import withTheme from "../hoc/with-theme"

const MainPage = ({ theme, toggleTheme }) => {

    return (
        <div className={`app ${theme}`}>
            <h1>MainPage</h1>
            <Button onClick={toggleTheme}>Toggle theme</Button>
            <Button onClick={() => alert("Hello! I'm alert!")}>Alert button</Button>
        </div>
    )

}

export default withTheme(MainPage)