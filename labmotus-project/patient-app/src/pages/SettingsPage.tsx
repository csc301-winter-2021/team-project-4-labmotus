import React, { FunctionComponent, useState } from "react";
import {
  IonListHeader,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonSearchbar,
  IonToggle,
} from "@ionic/react";

// @ts-ignore
import styled from "styled-components";
import {
  calendar,
  call,
  lockClosed,
  logOut,
  mail,
  person,
} from "ionicons/icons";

export interface SettingsPageProps {}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <SettingsPageDiv>
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
          ></IonSearchbar>

          <IonList>
            <IonListHeader>Profile</IonListHeader>
            <IonItem>
              <IonIcon slot="start" icon={person}></IonIcon>
              <IonLabel>Full Name</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={mail}></IonIcon>
              <IonLabel>email@email.com</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={call}></IonIcon>
              <IonLabel>(416) 932-3883</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={calendar}></IonIcon>
              <IonLabel>January 1, 1900</IonLabel>
            </IonItem>
            <IonListHeader>Password</IonListHeader>
            <IonItem>
              <IonIcon slot="start" icon={lockClosed}></IonIcon>
              <IonLabel>Change Password</IonLabel>
            </IonItem>
            <IonListHeader>Notifications</IonListHeader>
            <IonItem>
              <IonLabel>App Notifications</IonLabel>
              <IonToggle slot="end" checked={true}></IonToggle>
            </IonItem>
            <IonItem>
              <IonLabel>Call Notifications</IonLabel>
              <IonToggle slot="end" checked={true}></IonToggle>
            </IonItem>
          </IonList>
          <IonItem>
            <IonLabel>Logout</IonLabel>
            <IonIcon slot="end" icon={logOut}></IonIcon>
          </IonItem>
        </IonContent>
      </IonPage>
    </SettingsPageDiv>
  );
};

const SettingsPageDiv = styled.div`
  overflow: hidden;
`;

export default SettingsPage;
