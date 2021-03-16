import {FunctionComponent, useContext, useState} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";

export interface ChangePasswordProps {
    currPassword: string;
    setCurrPassword: any;
    newPassword: string;
    setNewPassword: any;
    confirmPassword: string;
    setConfirmPassword: any;
    save: any;
}

export const ChangePassword: FunctionComponent<ChangePasswordProps> = (props: ChangePasswordProps) => {
    const theme = useContext(getThemeContext());


    const [confirmPassword, setConfirmPassword] = useState<string>();

    return (
        <ChangePasswordDiv theme={theme}>
            <h1>Change Password</h1>
            <div className="main-padding">
                <div className="form">
                    <IonInput
                        type="password"
                        placeholder="Current Password"
                        autofocus={true}
                        clearInput={true}
                        value={props.currPassword}
                        onIonChange={(e) => props.setCurrPassword(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="New Password"
                        clearInput={true}
                        value={props.newPassword}
                        onIonChange={(e) => props.setNewPassword(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Confirm New Password"
                        clearInput={true}
                        value={props.confirmPassword}
                        onIonChange={(e) => props.setConfirmPassword(e.detail.value!)}
                    ></IonInput>
                </div>
                <button onClick={props.save} className="save-edit-button">
                    Change Password
                </button>
            </div>
        </ChangePasswordDiv>
    );
};

const ChangePasswordDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;
  }

  ion-input {
    text-align: center;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  .save-edit-button {
    width: 100%;
    font-size: 1em;
    padding: 14px;
    outline: none;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }
`;

export default ChangePassword;
