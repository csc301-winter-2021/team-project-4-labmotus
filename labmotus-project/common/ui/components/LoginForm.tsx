// @ts-ignore
import {FunctionComponent, useContext} from "react";
// @ts-ignore
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../theme/Theme";
import Button from "./Button";
import CenterWrapper from "./CenterWrapper";

export interface LoginFormProps {
    email: string;
    setEmail: any;
    password: string;
    setPassword: any;
    onLogin: any;
    onForgotPassword: any;
}

export const LoginForm: FunctionComponent<LoginFormProps> = (props: LoginFormProps) => {

    const theme = useContext(getThemeContext());

    return (
        <LoginFormDiv theme={theme}>
            <CenterWrapper>
                <div className="form">
                    <IonInput
                        class="input email"
                        placeholder="Email"
                        type="email"
                        inputmode="email"
                        value={props.email}
                        onIonChange={(e) => props.setEmail(e.detail.value!)}
                    />
                    <IonInput
                        class="input password"
                        placeholder="Password"
                        type="password"
                        value={props.password}
                        onIonChange={(e) => props.setPassword(e.detail.value!)}
                    />
                    <Button label="Login" onClick={props.onLogin} type="primary round"/>
                </div>
                <p onClick={props.onForgotPassword}>
                    <span>Forgot password?</span>
                </p>
            </CenterWrapper>
        </LoginFormDiv>
    );
};

const LoginFormDiv = styled.div`
  height: 100%;
  width: 100%;
  pointer-events: auto;

  .input {
    margin-bottom: 10px;
    text-align: left;
    border-radius: 5px;
    border: 1px solid #ddd;
    --padding-start: 10px;
  }

  @media only screen and (min-width: 768px) {
    .form {
      margin: 0 auto;
      max-width: 60vw;
    }
  }

  @media only screen and (min-width: 1024px) {
    .form {
      max-width: 40vw;
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${({theme}: { theme: Theme }) => theme.colors.light} inset !important;
  }
`;

export default LoginForm;
