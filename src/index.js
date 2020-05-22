import React from "react";
import ReactDOM from "react-dom";
import Example from "./Example";
import "./styles.css";

function App() {
    return <Example />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
