import { FunctionComponent, useContext } from "react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import logo from "../../../common/ui/assets/logo.webp"

export interface LoadingScreenProps {}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = ({}) => {
    const theme = useContext(getThemeContext());
    return (
        <LoadingScreenDiv classname="loading-screen-div" theme={theme}>
            <img src={logo} alt="" />
        </LoadingScreenDiv>
    );
};

const LoadingScreenDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        background-color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
    }
`;

export default LoadingScreen;
