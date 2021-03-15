import {FunctionComponent, useContext} from "react";
import {IonContent, IonPage,} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import API, {getAPIContext} from "../api/API";
import {Clinician} from "../../../common/types/types";
import SettingsList from "../../../common/ui/components/SettingsList";

import {useHistory} from "react-router";

export interface SettingsPageProps {
}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();

    const clinician: Clinician = UseAPI.getCurrentUser();

    // When user logs out
    async function onLogOut() {
        await UseAPI.logout();
    }

    // When user clicks on their email
    function editEmail() {
        history.push("/settings/edit-email");
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
                <IonContent fullscreen>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal: Settings</h3>
                    <div className="settings">
                        <SettingsList
                            patient={false}
                            name={clinician?.user?.name}
                            clinic={clinician?.clinic}
                            email={clinician?.user?.email}
                            editEmail={editEmail}
                            changePassword={changePassword}
                            viewTermsOfService={termsOfService}
                            onLogOut={onLogOut}
                            birthday={null}
                            editPhone={(): void => null}
                            phone={""}/>
                    </div>
                </IonContent>
            </IonPage>
        </SettingsPageDiv>
    );
};

const SettingsPageDiv = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  text-align: center;

  h1 {
    font-weight: bold;
    margin-top: 15vh;
  }

  .settings {
    max-width: 80vw;
    margin: 0 auto;
  }
`;

export default SettingsPage;
