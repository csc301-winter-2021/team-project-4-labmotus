import React from "react";
import "../fonts/fonts.css"

export interface Theme {
    primaryFontSize: string;
    primaryFontFamily: string;
    secondaryFontSize: string;
    secondaryFontFamily: string;
    colors: Colors;
}

export interface Colors {
    primary: string;
    secondary: string;
    light: string;
    contrast: string;
    shade: string;
}

export const PrimaryTheme: Theme = {
    primaryFontSize: "16px",
    primaryFontFamily: "Roboto",
    secondaryFontSize: "10px",
    secondaryFontFamily: "Roboto",
    colors: {
        primary: "#3880ff",
        secondary: "#3dc2ff",
        light: "#f4f5f8",
        contrast: "#000000",
        shade: "#d7d8da"
    }
};

export const ThemeContext = React.createContext(PrimaryTheme);
