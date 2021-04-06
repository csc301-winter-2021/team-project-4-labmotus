import {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import { getThemeContext, Theme } from "../theme/Theme";

export interface ButtonProps {
    label: string;
    onClick?: () => void;
    type: string;
}

const Button: FunctionComponent<ButtonProps> = ({
                                                          label,
                                                          onClick: onClickCallback,
                                                      }) => {
    
    const theme = useContext(getThemeContext());

    function onClick() {
        if (onClickCallback !== undefined)
            onClickCallback();
    }

    return (render(
            <ButtonStyle on-click={onClick} className={type} theme={theme}>
                {label}
            </ButtonStyle>
        );)
};

const ButtonStyle = styled.button`
  margin-bottom: 10px;
  width: 100%;
  font-size: 1em;
  padding: 14px;
  outline: none;
  .primary {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }
`;

export default Button;
function useContext(arg0: any) {
    throw new Error("Function not implemented.");
}

