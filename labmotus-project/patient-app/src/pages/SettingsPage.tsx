import {FunctionComponent, useContext} from "react";
import {IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import API from "../api/API";
import {Patient} from "../../../common/types/types";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import SettingsList from "../../../common/ui/components/SettingsList";
import Header from "../../../common/ui/components/Header"

import {useHistory} from "react-router";
import {getAPIContext} from "../../../common/api/BaseAPI";

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
    function onEditEmail() {
        history.push("/settings/edit-email");
    }

    // When user clicks on their phone number
    function onEditPhone() {
        history.push("/settings/edit-phone");
    }

    // When user clicks on 'Change Password'
    function onChangePassword() {
        history.push("/settings/change-password");
    }

    // When user clicks on 'Terms of Service'
    function termsOfService() {
        history.push("/terms-of-service");
    }

    return (
        <SettingsPageDiv>
            <IonPage>
                <Header title="Settings"/>
                <IonContent fullscreen>
                    <SettingsList
                        patient={true}
                        name={patient?.user?.name}
                        editName={(): void => null}
                        clinic=""
                        editClinic={(): void => null}
                        birthday={patient?.birthday.format(theme.birthdayFormat)}
                        email={patient?.user?.email}
                        editEmail={onEditEmail}
                        phone={patient?.phone}
                        editPhone={onEditPhone}
                        changePassword={onChangePassword}
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
