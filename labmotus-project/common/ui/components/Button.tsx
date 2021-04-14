import {FunctionComponent, useContext} from "react";
// @ts-ignore
import styled from 'styled-components';
import {getThemeContext, Theme} from "../theme/Theme";

export interface ButtonProps {
    label: string;
    onClick?: () => void;
    type: string;
}

const Button: FunctionComponent<ButtonProps> = ({label, onClick: onClickCallback, type}) => {

    const theme = useContext(getThemeContext());

    function onClick() {
        if (onClickCallback !== undefined)
            onClickCallback();
    }

    return (
        <ButtonStyle onClick={onClick} className={type} theme={theme}>
            {label}
        </ButtonStyle>
    )
};

const ButtonStyle = styled.button`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  
  padding: 12px;
  outline: none;
  width: 100%;
  max-width: 490px;
  font-size: 0.85em;
  text-transform: capitalize;

  @media only screen and (min-width: 768px) {
    font-size: 1em;
  }
  
  &.primary {
    color: ${({theme}: { theme: Theme }) => theme.colors.primaryContrast};
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
  }

  &.secondary {
    color: ${({theme}: { theme: Theme }) => theme.colors.secondaryContrast};
    background-color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
  }

  &.round {
    border-radius: 25px;
  }
  
  &.full {
    max-width: none;
  }
`;

export default Button;

