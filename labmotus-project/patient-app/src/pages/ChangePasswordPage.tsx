import {FunctionComponent, useContext, useState} from "react";
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
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API from "../api/API";
import {useHistory} from "react-router";
import {chevronBack} from "ionicons/icons";
import {getAPIContext} from "../../../common/api/BaseAPI";

export interface ChangePasswordPageProps {
}

const ChangePasswordPage: FunctionComponent<ChangePasswordPageProps> = () => {
    const theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();

    const [currPassword, setCurrPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

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
            const pass = await UseAPI.changePassword(currPassword, newPassword);
            console.log(pass, "testing in change password for patient");
        } catch (e) {
            console.error(e);
        } finally {
            history.push(`/settings`);
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
                            <IonIcon icon={chevronBack}/>
                            Back
                        </IonButtons>
                        <IonButtons slot="end" onClick={changePassword}>
                            Save
                        </IonButtons>
                        <IonTitle>Change Password</IonTitle>
                    </IonToolbar>
                </IonHeader>
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

  ion-buttons {
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    cursor: pointer;

    ion-icon {
      height: 25px;
      width: 25px;
    }
  }
`;

export default ChangePasswordPage;
