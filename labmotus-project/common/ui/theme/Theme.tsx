import { Context, createContext } from 'react';
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
    dateFormat: string;
    birthdayFormat: string;
}

export interface Colors {
    primary: string;
    secondary: string;
    light: string;
    background: string;
    contrast: string;
    shade: string;
    mediumShade: string;
    darkShade: string;
    success: string;
    warning: string;
    alert: string;
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
        primary: "#000000",
        secondary: "#115026",
        light: "#f4f5f8",
        background: "#FFFFFF",
        contrast: "#000000",
        shade: "#d7d8da",
        mediumShade: "#7a7a7a",
        darkShade: "#1e2023",
        success: "#36ba62",
        warning: "#ffd534",
        alert: "#d62728",
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
    dateFormat: "dddd, MMMM Do, YYYY",
    birthdayFormat: "MMMM Do, YYYY",
};

export function getThemeContext(): Context<Theme> {
    return createContext(PrimaryTheme)
}

// export const ThemeContext: React.Context<Theme> = React.createContext(PrimaryTheme);
