import React from "react"
import withTheme from "../hoc/with-theme"
import "./button.scss"

const Button = ({ onClick, children, theme }) => {

    return (
        <button
                onClick={onClick}
                className={`btn ${theme}`}>
            {children}
        </button>
    )
}

export default withTheme(Button)