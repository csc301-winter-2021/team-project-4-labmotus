import {FunctionComponent, useContext, useState} from "react";
import {
    IonAlert,
    IonContent,
    IonInput,
    IonPage,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API from "../api/API";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Header from "../../../common/ui/components/Header"

export interface ChangePasswordPageProps {
}

const ChangePasswordPage: FunctionComponent<ChangePasswordPageProps> = () => {
    const theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());

    const [currPassword, setCurrPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();

    const [redirectLogout, openRedirectLogout] = useState<boolean>(false);
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    // When user logs out
    async function onLogOut() {
        await UseAPI.logout();
    }

    async function changePassword() {
        if (!currPassword || !newPassword || !confirmPassword) {
            setHeader("Enter Password");
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
        if (currPassword === newPassword) {
            setHeader("Change Password");
            setMessage("The new password you entered is the same as your old one. Please enter a different password.");
            openAlert(true);
            setNewPassword("");
            setConfirmPassword("");
            return;
        }
        try {
            const changePassResult = await UseAPI.changePassword(currPassword, newPassword);
            switch (changePassResult) {
                case "success":
                    openRedirectLogout(true);
                    return;
                case "wrong-password":
                    // User has entered the wrong current password
                    setHeader("Incorrect Password");
                    setMessage("The current password you entered is incorrect. Please try again.");
                    openAlert(true);
                    setNewPassword("");
                    setConfirmPassword("");
                    return;
                case "weak-password":
                    // User chose a new weak password under 6 characters
                    setHeader("Weak Password");
                    setMessage("Please choose a new password that's at least 6 characters.");
                    openAlert(true);
                    setNewPassword("");
                    setConfirmPassword("");
                    return;
                default:
                    setHeader("Error");
                    setMessage("An error has occurred while changing your password. Please try again later.");
                    openAlert(true);
                    console.log(changePassResult);
                    return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <ChangePasswordPageDiv theme={theme}>
            <IonPage>
                <Header onBackClick onSaveClick={changePassword} title="Change Password"/>
                <IonContent>
                    <div className="form">
                        <IonInput
                            type="password"
                            placeholder="Current Password"
                            value={currPassword}
                            autofocus={true}
                            onIonChange={(e) => setCurrPassword(e.detail.value!)}
                        />
                        <IonInput
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onIonChange={(e) => setNewPassword(e.detail.value!)}
                        />
                        <IonInput
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                        />
                    </div>
                </IonContent>
            </IonPage>
            <IonAlert
                isOpen={redirectLogout}
                onDidDismiss={() => {
                    openRedirectLogout(false);
                    onLogOut();
                }}
                header="Password Changed"
                message="Your password has been successfully changed."
                buttons={["OK"]}
            />
            <IonAlert
                isOpen={isError}
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
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

`;

export default ChangePasswordPage;
