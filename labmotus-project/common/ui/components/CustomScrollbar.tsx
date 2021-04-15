import React, {FunctionComponent, useContext} from "react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../theme/Theme";
// @ts-ignore
import Scrollbar from "react-scrollbars-custom";

export interface ScrollbarProps {
    children: any;
}

const CustomScrollbar: FunctionComponent<ScrollbarProps> = ({children}) => {

    const theme = useContext(getThemeContext());

    return (
        <ScrollbarStyle theme={theme}>
            {children}
        </ScrollbarStyle>
    );
};

const ScrollbarStyle = styled(Scrollbar)`
  .ScrollbarsCustom-Track {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.shade} !important;
  }

  .ScrollbarsCustom-Thumb {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary} !important;
  }
`;
export default CustomScrollbar;
