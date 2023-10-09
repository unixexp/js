import React from "react";
import "./app.scss";

import ThemeProvider from "../theme-context/theme-provider";
import MainPage from "../main-page/main-page"

const App = () => {

    return (
        <ThemeProvider>
            <MainPage />
        </ThemeProvider>
    );

};

export default App;