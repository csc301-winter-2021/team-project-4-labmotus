// @ts-ignore
import React, {FunctionComponent} from "react";
// @ts-ignore
import {IonButton, IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

export interface LoginFormProps {
    email: string,
    setEmail: any,
    password: string,
    setPassword: any,
    onLogin: any,
    onForgotPassword: any
}

export const LoginForm: FunctionComponent<LoginFormProps> = (props: LoginFormProps) => {
    return (
        <LoginFormDiv>
            <div>
                <form>
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

                    <IonButton expand="block" shape="round" onClick={props.onLogin}>
                        Login
                    </IonButton>
                </form>
                <p onClick={props.onForgotPassword}><span>Forgot password?</span></p>
            </div>
        </LoginFormDiv>
    )
}

const LoginFormDiv = styled.div`
    height: 100%;
    width: 100%;
    .input {
        margin-bottom: 5%;
        text-align: left;
        border-radius: 5px;
        border: 1px solid #ddd;
        --padding-start: 10px;
    }
    pointer-events: auto;
`;

export default LoginForm;