import {FunctionComponent, useContext} from "react";
import {IonIcon, IonItem, IonLabel, IonList, IonListHeader} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {
    businessOutline,
    calendarClearOutline,
    callOutline,
    helpCircleOutline,
    lockClosedOutline,
    logOutOutline,
    mailOutline,
    personOutline,
} from "ionicons/icons";
import {getThemeContext, Theme} from "../theme/Theme";

export interface SettingsListProps {
    patient: boolean;
    name: string;
    clinic?: string;
    birthday?: string;
    email: string;
    editEmail: any;
    phone: string;
    editPhone: any;
    changePassword: any;
    viewTermsOfService: any;
    onLogOut: any;
}

export const SettingsList: FunctionComponent<SettingsListProps> = (props: SettingsListProps) => {

    const theme = useContext(getThemeContext());

    return (
        <SettingsListDiv theme={theme}>
            <IonList>
                <IonListHeader>Profile</IonListHeader>
                <IonItem>
                    <IonIcon slot="start" icon={personOutline}/>
                    <IonLabel>{props.name}</IonLabel>
                </IonItem>
                {props.patient && (
                    <IonItem>
                        <IonIcon slot="start" icon={calendarClearOutline}/>
                        <IonLabel>{props.birthday}</IonLabel>
                    </IonItem>
                )}
                {!props.patient && (
                    <IonItem>
                        <IonIcon slot="start" icon={businessOutline}/>
                        <IonLabel>{props.clinic}</IonLabel>
                    </IonItem>
                )}
                <IonItem button={true} onClick={props.editEmail}>
                    <IonIcon slot="start" icon={mailOutline}/>
                    <IonLabel>{props.email}</IonLabel>
                </IonItem>
                {props.patient && (
                    <IonItem button={true} onClick={props.editPhone}>
                        <IonIcon slot="start" icon={callOutline}/>
                        <IonLabel>{props.phone}</IonLabel>
                    </IonItem>
                )}
                <IonListHeader>Password</IonListHeader>
                <IonItem button={true} onClick={props.changePassword}>
                    <IonIcon slot="start" icon={lockClosedOutline}/>
                    <IonLabel>Change Password</IonLabel>
                </IonItem>
                <IonListHeader>About</IonListHeader>
                <IonItem button={true} onClick={props.viewTermsOfService}>
                    <IonIcon slot="start" icon={helpCircleOutline}/>
                    <IonLabel>Terms of Service</IonLabel>
                </IonItem>
            </IonList>
            <button onClick={props.onLogOut} className="logout-button">
                Logout <IonIcon slot="end" icon={logOutOutline}/>
            </button>
        </SettingsListDiv>
    );
};

const SettingsListDiv = styled.div`
  height: 100%;
  width: 100%;

  .logout-button {
    width: 100%;
    max-width: 490px;
    font-size: 1em;
    padding: 14px;
    outline: none;
    background-color: transparent;
    color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
  }
`;

export default SettingsList;
