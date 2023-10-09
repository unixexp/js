import React from "react"
import ThemeContext from "../theme-context/theme-context"

const withTheme = (Component) => {
    return (props) => {
        return (
            <ThemeContext.Consumer>
                {(context) => <Component {...props} {...context}/>}
            </ThemeContext.Consumer>
        )
    }
}

export default withTheme