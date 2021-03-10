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
import { calendar, call, lockClosed, logOut, mail, person } from "ionicons/icons";
import { APIContext } from "../api/API";
import { Patient } from "../../../common/types/types";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";

import { useHistory } from "react-router";

export interface SettingsPageProps {}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
    const theme: Theme = useContext(getThemeContext());
    const API = useContext(APIContext);
    const patient: Patient = API.getCurrentUser();
    const history = useHistory();

    async function onLogOut() {
        await API.logout();
    }

    function editEmail() {
        history.push("/settings/edit-email");
    }

    function editPhone() {
        history.push("/settings/edit-phone");
    }

    function changePassword() {
        history.push("/settings/change-password");
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
                        </IonItem>
                        <IonItem onClick={editPhone}>
                            <IonIcon slot="start" icon={call} />
                            <IonLabel>{patient?.phone}</IonLabel>
                        </IonItem>
                        <IonListHeader>Password</IonListHeader>
                        <IonItem onClick={changePassword}>
                            <IonIcon slot="start" icon={lockClosed} />
                            <IonLabel>Change Password</IonLabel>
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

