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
  font-size: 0.95em;
  padding: 14px;
  outline: none;
  width: 100%;
  max-width: 490px;
  
  &.primary {
    color: white;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
  }

  &.secondary {
    color: white;
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

