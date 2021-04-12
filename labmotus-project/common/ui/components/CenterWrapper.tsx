import {FunctionComponent} from "react";
// @ts-ignore
import styled from "styled-components";

export interface WrapperProps {
    children: any;
}

const CenterWrapper: FunctionComponent<WrapperProps> = ({children}) => {
    return (
        <WrapperStyle>
            {children}
        </WrapperStyle>
    );
};

const WrapperStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  padding: 5%;
  box-sizing: border-box;
`;

export default CenterWrapper;
