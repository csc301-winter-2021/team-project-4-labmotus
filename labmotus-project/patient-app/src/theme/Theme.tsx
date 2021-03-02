import React from "react";
import "../fonts/fonts.css"

export interface Theme {
    primaryFontSize: string;
    primaryFontFamily: string;
    headerFontSize: string;
    headerFontFamily: string;
    subheaderFontSize: string;
    subheaderFontFamily: string;
    secondaryFontSize: string;
    secondaryFontFamily: string;
    colors: Colors;
    locale: string;
}

export interface Colors {
    primary: string;
    secondary: string;
    light: string;
    contrast: string;
    shade: string;
    mediumShade: string;
    darkShade: string;
    cycle: string[];
}

export const PrimaryTheme: Theme = {
    primaryFontSize: "16px",
    primaryFontFamily: "Roboto",
    headerFontSize: "20px",
    headerFontFamily: "Roboto",
    subheaderFontSize: "14px",
    subheaderFontFamily: "Roboto",
    secondaryFontSize: "10px",
    secondaryFontFamily: "Roboto",
    colors: {
        primary: "#3880ff",
        secondary: "#3dc2ff",
        light: "#f4f5f8",
        contrast: "#000000",
        shade: "#d7d8da",
        mediumShade: "#808289",
        darkShade: "#1e2023",
        cycle: [
            '#1f77b4',
            '#ff7f0e',
            '#2ca02c',
            '#d62728',
            '#9467bd',
            '#8c564b',
            '#e377c2',
            '#7f7f7f',
            '#bcbd22',
            '#17becf'
        ],
    },
    locale: "en-US",
};

export const ThemeContext = React.createContext(PrimaryTheme);
