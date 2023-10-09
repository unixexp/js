import React, { useState } from "react";
import Slider from "../slider/slider"

const App = () => {

    const images = [
        { src: "amp.jpg" },
        { src: "dj.jpg" },
        { src: "effect.jpeg" },
        { src: "gibson-exclusive-collection.jpg" },
        { src: "headphones.jpeg" },
        { src: "keys.jpg" },
        { src: "remni.jpeg" },
        { src: "studio.jpeg" }
    ]

    return (
        <div>
            <Slider images={images}/>
        </div>
    );

};

export default App;