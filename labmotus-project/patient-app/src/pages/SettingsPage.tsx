import React, {FunctionComponent, useContext, useState} from "react";
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonSearchbar,
    IonTitle,
    IonToggle,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {calendar, call, lockClosed, logOut, mail, person,} from "ionicons/icons";
import {APIContext} from "../api/API";
import {Patient} from "../../../common/types/types";
import {ThemeContext} from "../theme/Theme";

export interface SettingsPageProps {
}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
    const theme = useContext(ThemeContext);
    const API = useContext(APIContext);
    const [searchText, setSearchText] = useState("");
    const patient: Patient = API.getCurrentUser();

    async function onLogOut() {
        await API.logout();
    }

    return (
        <SettingsPageDiv classname="settings-page">
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => setSearchText(e.detail.value!)}
                    />

                    <IonList>
                        <IonListHeader>Profile</IonListHeader>
                        <IonItem>
                            <IonIcon slot="start" icon={person}/>
                            <IonLabel>{patient?.user?.name}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonIcon slot="start" icon={mail}/>
                            <IonLabel>{patient?.user?.email}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonIcon slot="start" icon={call}/>
                            <IonLabel>{patient?.phone}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonIcon slot="start" icon={calendar}/>
                            <IonLabel>{patient?.birthday?.format(theme.dateFormat)}</IonLabel>
                        </IonItem>
                        <IonListHeader>Password</IonListHeader>
                        <IonItem>
                            <IonIcon slot="start" icon={lockClosed}/>
                            <IonLabel>Change Password</IonLabel>
                        </IonItem>
                        <IonListHeader>Notifications</IonListHeader>
                        <IonItem>
                            <IonLabel>App Notifications</IonLabel>
                            <IonToggle slot="end" checked={true}/>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Call Notifications</IonLabel>
                            <IonToggle slot="end" checked={true}/>
                        </IonItem>
                    </IonList>
                    <IonItem onClick={onLogOut}>
                        <IonLabel>Logout</IonLabel>
                        <IonIcon slot="end" icon={logOut}/>
                    </IonItem>
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
