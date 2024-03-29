import {FunctionComponent, useContext} from "react";
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import API, {getAPIContext} from "../api/API";
import {Patient} from "../../../common/types/types";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import SettingsList from "../../../common/ui/components/SettingsList";

import {useHistory} from "react-router";

export interface SettingsPageProps {
}

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
                    <SettingsList
                        patient={true}
                        name={patient?.user?.name}
                        birthday={patient?.birthday.format(theme.birthdayFormat)}
                        email={patient?.user?.email}
                        editEmail={editEmail}
                        phone={patient?.phone}
                        editPhone={editPhone}
                        changePassword={changePassword}
                        viewTermsOfService={termsOfService}
                        onLogOut={onLogOut}
                    />
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
