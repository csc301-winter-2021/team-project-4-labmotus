import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

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
            <CenterWrapper>
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
                <div className="buttons">
                    <Button label="Change Password" onClick={props.save} type="primary full"
                            data-testid="change-password"/>
                    <Button label="Cancel" onClick={() => props.setChangePassword(false)} type="full" data-testid="cancel"/>
                </div>
            </CenterWrapper>
        </ChangePasswordDiv>
    );
};

const ChangePasswordDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;

  ion-input {
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
    --padding-start: 10px;
  }

  .buttons > * {
    margin-top: 10px;
  }
`;

export default ChangePassword;
