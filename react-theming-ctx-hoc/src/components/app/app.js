import React from "react";
import "./app.scss";

import ThemeProvider from "../theme-context/theme-provider";
import MainPage from "../main-page/main-page"
import Button from "../button/button";

const App = () => {

    return (
        <div>
            <ThemeProvider>
                <MainPage />
            </ThemeProvider>
        </div>
    );

};

export default App;