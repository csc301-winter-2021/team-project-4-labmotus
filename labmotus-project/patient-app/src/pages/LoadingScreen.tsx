import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";

export interface LoadingScreenProps {
}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = ({}) => {
    const theme = React.useContext(ThemeContext);
    return (<LoadingScreenDiv classname="loading-screen-div" theme={theme}>
        <img src="/assets/logo.webp" alt=""/>
    </LoadingScreenDiv>)
};

const LoadingScreenDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    }
`;

export default LoadingScreen;
