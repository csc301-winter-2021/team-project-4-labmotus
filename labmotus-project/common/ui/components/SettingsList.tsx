import {FunctionComponent} from "react";
import {IonButton, IonIcon, IonItem, IonLabel, IonList, IonListHeader} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {
    chevronForward,
    lockClosedOutline,
    helpCircleOutline,
    personOutline,
    calendarClearOutline,
    businessOutline,
    callOutline,
    mailOutline,
    logOutOutline,
} from "ionicons/icons";

export interface SettingsListProps {
    patient: boolean;
    name: string;
    clinic: string;
    birthday: string;
    email: string;
    editEmail: any;
    phone: string;
    editPhone: any;
    changePassword: any;
    viewTermsOfService: any;
    onLogOut: any;
}

export const SettingsList: FunctionComponent<SettingsListProps> = (props: SettingsListProps) => {
    return (
        <SettingsListDiv>
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
                <IonItem onClick={props.editEmail}>
                    <IonIcon slot="start" icon={mailOutline}/>
                    <IonLabel>{props.email}</IonLabel>
                    <IonIcon slot="end" icon={chevronForward}/>
                </IonItem>
                {props.patient && (
                    <IonItem onClick={props.editPhone}>
                        <IonIcon slot="start" icon={callOutline}/>
                        <IonLabel>{props.phone}</IonLabel>
                        <IonIcon slot="end" icon={chevronForward}/>
                    </IonItem>
                )}
                <IonListHeader>Password</IonListHeader>
                <IonItem onClick={props.changePassword}>
                    <IonIcon slot="start" icon={lockClosedOutline}/>
                    <IonLabel>Change Password</IonLabel>
                    <IonIcon slot="end" icon={chevronForward}/>
                </IonItem>
                <IonListHeader>About</IonListHeader>
                <IonItem onClick={props.viewTermsOfService}>
                    <IonIcon slot="start" icon={helpCircleOutline}/>
                    <IonLabel>Terms of Service</IonLabel>
                    <IonIcon slot="end" icon={chevronForward}/>
                </IonItem>
            </IonList>
            <IonButton onClick={props.onLogOut} expand="full" fill="clear" color="primary">
                Logout
                <IonIcon slot="end" icon={logOutOutline}/>
            </IonButton>
        </SettingsListDiv>
    );
};

const SettingsListDiv = styled.div`
  height: 100%;
  width: 100%;

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;

    .input {
      margin-bottom: 10px;
      text-align: left;
      border-radius: 5px;
      border: 1px solid #ddd;
      --padding-start: 10px;
    }

    .login-button {
      width: 100%;
      border-radius: 25px;
      max-width: 490px;
      font-size: 0.8em;
      padding: 14px;
      font-weight: 500;
      outline: none;
      box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
    }

    @media only screen and (min-width: 768px) {
      form {
        margin: 0 auto;
        max-width: 60vw;
      }

      .login-button {
        font-size: 1.1em;
      }
    }
    @media only screen and (min-width: 1024px) {
      form {
        max-width: 40vw;
      }
    }
    pointer-events: auto;
  }
`;

export default SettingsList;
