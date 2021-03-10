import React, { FunctionComponent, useContext, useState } from "react";
import {
    IonAlert,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import { Theme, getThemeContext } from "../../../common/ui/theme/Theme";
import { APIContext } from "../api/API";
import { useHistory } from "react-router";
import { chevronBack } from "ionicons/icons";

export interface ChangePasswordPageProps {}

const ChangePasswordPage: FunctionComponent<ChangePasswordPageProps> = () => {
    const theme = useContext(getThemeContext());
    const API = useContext(APIContext);
    const history = useHistory();

    const [currPassword, setCurrPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [iserror, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    async function changePassword() {
        if (!currPassword || !newPassword || !confirmPassword) {
            setHeader("Invalid Password");
            setMessage("Please enter your current password and set a new one.");
            openAlert(true);
            setConfirmPassword("");
            return;
        }
        if (newPassword !== confirmPassword) {
            setHeader("Passwords Don't Match");
            setMessage("The passwords don't match. Please try again.");
            openAlert(true);
            setConfirmPassword("");
            return;
        }
        alert("new password is " + newPassword);
        try {
            // await API.changePassword(password);
            history.push(`/settings`);
        } catch (e) {
            console.error(e);
        }
    }

    function back() {
        history.push(`/settings`);
    }

    return (
        <ChangePasswordPageDiv theme={theme}>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={back}>
                            <IonIcon icon={chevronBack} />
                            Back
                        </IonButtons>
                        <IonButtons slot="end" onClick={changePassword}>
                            Save
                        </IonButtons>
                        <IonTitle>Change Password</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonInput
                        type="password"
                        placeholder="Current Password"
                        autofocus={true}
                        clearInput={true}
                        value={currPassword}
                        onIonChange={(e) => setCurrPassword(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="New Password"
                        clearInput={true}
                        value={newPassword}
                        onIonChange={(e) => setNewPassword(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Confirm New Password"
                        clearInput={true}
                        value={confirmPassword}
                        onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    ></IonInput>
                </IonContent>
            </IonPage>
            <IonAlert
                isOpen={iserror}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </ChangePasswordPageDiv>
    );
};

const ChangePasswordPageDiv = styled.div`
    overflow: hidden;
    width: 100%;
    height: 100%;
    ion-input {
        margin: 10px 0;
        background-color: ${({ theme }: { theme: Theme }) => theme.colors.light};
    }
    ion-buttons {
        color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
        cursor: pointer;
        ion-icon {
            height: 25px;
            width: 25px;
        }
    }
`;

export default ChangePasswordPage;
