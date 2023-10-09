import React from "react"
import APIContext from "../api-context/api-context";

const withAPI = (Component) => {
    return (props) => {
        return (
            <APIContext.Consumer>
                {(context) => <Component {...props} {...context}/>}
            </APIContext.Consumer>
        )
    }
}

export default withAPI