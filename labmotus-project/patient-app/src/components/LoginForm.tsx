// @ts-ignore
import React, {FunctionComponent} from "react";
// @ts-ignore
import {IonButton, IonInput} from "@ionic/react";

export interface LoginFormProps {
    email: string,
    setEmail: any,
    password: string,
    setPassword: any,
    login: any,
    forgotPassword: any
}

export const LoginForm: FunctionComponent<LoginFormProps> = (props: LoginFormProps) => {
    return (
        <div className="main">
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

                <IonButton expand="block" shape="round" onClick={props.login}>
                    Login
                </IonButton>
            </form>
            <p onClick={props.forgotPassword}><span>Forgot password?</span></p>
        </div>
    )
}

export default LoginForm;