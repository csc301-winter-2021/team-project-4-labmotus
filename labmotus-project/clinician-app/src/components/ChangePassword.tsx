import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";

export interface ChangePasswordProps {
    currPassword: string;
    setCurrPassword: any;
    newPassword: string;
    setNewPassword: any;
    confirmPassword: string;
    setConfirmPassword: any;
    setChangePassword: any;
    save: any;
}

export const ChangePassword: FunctionComponent<ChangePasswordProps> = (props: ChangePasswordProps) => {
    const theme = useContext(getThemeContext());

    return (
        <ChangePasswordDiv theme={theme} data-testid="ChangePasswordComponent">
            <h1>Change Password</h1>
            <div className="main-padding">
                <div className="form">
                    <IonInput
                        type="password"
                        placeholder="Current Password"
                        value={props.currPassword}
                        onIonChange={(e) => props.setCurrPassword(e.detail.value!)}
                        data-testid="current-password"
                    />
                    <IonInput
                        type="password"
                        placeholder="New Password"
                        value={props.newPassword}
                        onIonChange={(e) => props.setNewPassword(e.detail.value!)}
                        data-testid="new-password"
                    />
                    <IonInput
                        type="password"
                        placeholder="Confirm New Password"
                        value={props.confirmPassword}
                        onIonChange={(e) => props.setConfirmPassword(e.detail.value!)}
                        data-testid="confirm-password"
                    />
                </div>
                <Button label="Change Password" onClick={props.save} type="primary" data-testid="change-password"/>
                <Button label="Cancel" onClick={props.setChangePassword(false)} data-testid="cancel"/>
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
`;

export default ChangePassword;
