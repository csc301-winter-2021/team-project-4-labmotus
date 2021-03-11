import { FunctionComponent, useContext } from "react";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import { calendar, call, chevronForward, helpCircleOutline, lockClosed, logOut, mail, person } from "ionicons/icons";
import API, { getAPIContext } from "../api/API";
import { Patient } from "../../../common/types/types";
import { Theme, getThemeContext } from "../../../common/ui/theme/Theme";

import { useHistory } from "react-router";

export interface SettingsPageProps {}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
    const theme: Theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());
    const patient: Patient = UseAPI.getCurrentUser();
    const history = useHistory();

    // When user logs out
    async function onLogOut() {
        await UseAPI.logout();
    }

    // When user clicks on their email
    function editEmail() {
        history.push("/settings/edit-email");
    }

    // When user clicks on their phone number
    function editPhone() {
        history.push("/settings/edit-phone");
    }

    // When user clicks on 'Change Password'
    function changePassword() {
        history.push("/settings/change-password");
    }

    // When user clicks on 'Terms of Service'
    function termsOfService() {
        history.push("/terms-of-service");
    }

    return (
        <SettingsPageDiv>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonList>
                        <IonListHeader>Profile</IonListHeader>
                        <IonItem>
                            <IonIcon slot="start" icon={person} />
                            <IonLabel>{patient?.user?.name}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonIcon slot="start" icon={calendar} />
                            <IonLabel>{patient?.birthday?.format(theme.birthdayFormat)}</IonLabel>
                        </IonItem>
                        <IonItem onClick={editEmail}>
                            <IonIcon slot="start" icon={mail} />
                            <IonLabel>{patient?.user?.email}</IonLabel>
                            <IonIcon slot="end" icon={chevronForward} />
                        </IonItem>
                        <IonItem onClick={editPhone}>
                            <IonIcon slot="start" icon={call} />
                            <IonLabel>{patient?.phone}</IonLabel>
                            <IonIcon slot="end" icon={chevronForward} />
                        </IonItem>
                        <IonListHeader>Password</IonListHeader>
                        <IonItem onClick={changePassword}>
                            <IonIcon slot="start" icon={lockClosed} />
                            <IonLabel>Change Password</IonLabel>
                            <IonIcon slot="end" icon={chevronForward} />
                        </IonItem>
                        <IonListHeader>About</IonListHeader>
                        <IonItem onClick={termsOfService}>
                            <IonIcon slot="start" icon={helpCircleOutline} />
                            <IonLabel>Terms of Service</IonLabel>
                            <IonIcon slot="end" icon={chevronForward} />
                        </IonItem>
                    </IonList>
                    <IonButton onClick={onLogOut} expand="full" fill="clear" color="primary">
                        Logout
                        <IonIcon slot="end" icon={logOut} />
                    </IonButton>
                </IonContent>
            </IonPage>
        </SettingsPageDiv>
    );
};

const SettingsPageDiv = styled.div`
    overflow: hidden;
    width: 100%;
    height: 100%;
`;

export default SettingsPage;
