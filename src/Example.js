import React from "react";
import useSlider from "./useSlider";

function Example(props) {
    const [hotAreaProps, thumbProps, sliderState] = useSlider({
        initRatio: 0.5,
        horizon: true
    });

    const { ratio, reset, setRatio } = sliderState;

    if (!reset) {
        // save ratio
    }

    return (
        <>
            <button onClick={() => setRatio(0)}>0</button>
            <button onClick={() => setRatio(0.5)}>0.5</button>
            <button onClick={() => setRatio(1)}>1</button>
            <div className="val">{ratio}</div>
            <div className="slider">
                <div className="track" {...hotAreaProps} />
                <div className="has" style={{ width: `${ratio * 100}%` }}>
                    <div className="ctrl" {...thumbProps} />
                </div>
            </div>
        </>
    );
}

export default Example;
