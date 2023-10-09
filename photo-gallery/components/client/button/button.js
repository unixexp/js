import React from "react"
import withTheme from "../hoc/with-theme"
import styles from "./button.module.scss"

const Button = ({ onClick, children }) => {

    return (
        <button
                onClick={onClick}
                className={styles.Button}>
            {children}
        </button>
    )
}

export default Button