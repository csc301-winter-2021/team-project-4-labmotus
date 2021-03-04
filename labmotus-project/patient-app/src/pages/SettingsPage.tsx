import React, {FunctionComponent, useState} from "react";
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

export interface SettingsPageProps {}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
  const [searchText, setSearchText] = useState("");

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
                          <IonLabel>Full Name</IonLabel>
                      </IonItem>
                      <IonItem>
                          <IonIcon slot="start" icon={mail}/>
                          <IonLabel>email@email.com</IonLabel>
            </IonItem>
            <IonItem>
                <IonIcon slot="start" icon={call}/>
                <IonLabel>(416) 932-3883</IonLabel>
            </IonItem>
            <IonItem>
                <IonIcon slot="start" icon={calendar}/>
                <IonLabel>January 1, 1900</IonLabel>
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
          <IonItem>
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
