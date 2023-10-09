import React, { useContext } from "react"
import ThemeContext from "../theme-context/theme-context"
import "./button.scss"

const Button = ({ onClick, children }) => {

    const { theme } = useContext(ThemeContext)

    return (
        <button
                onClick={onClick}
                className={`btn ${theme}`}>
            {children}
        </button>
    )
}

export default Button