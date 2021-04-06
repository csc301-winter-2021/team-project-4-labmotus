import {FunctionComponent, useContext} from "react";
// @ts-ignore
import styled from 'styled-components';
import {getThemeContext, Theme} from "../theme/Theme";

export interface ButtonProps {
    label: string;
    onClick?: () => void;
}

const Button: FunctionComponent<ButtonProps> = ({label, onClick: onClickCallback}) => {

    const theme = useContext(getThemeContext());

    function onClick() {
        if (onClickCallback !== undefined)
            onClickCallback();
    }

    return (
        <ButtonStyle on-click={onClick} theme={theme}>
            {label}
        </ButtonStyle>
    )
};

const ButtonStyle = styled.button`
  font-size: 1em;
  padding: 14px;
  outline: none;
  color: white;
  background-color: ${props => props.secondary ? ({theme}: { theme: Theme }) => theme.colors.secondary : ({theme}: { theme: Theme }) => theme.colors.primary};
`;

export default Button;

