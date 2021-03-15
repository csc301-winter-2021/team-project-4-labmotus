import {FunctionComponent, useContext, useState} from "react";
import {IonContent, IonModal, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import API, {getAPIContext} from "../api/API";
import {Clinician} from "../../../common/types";
import SettingsList from "../../../common/ui/components/SettingsList";

import {useHistory} from "react-router";
import EditEmail from "../components/EditEmail";
import ChangePassword from "../components/ChangePassword";

export interface SettingsPageProps {
}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();

    let clinician: Clinician = UseAPI.getCurrentUser();
    const clinicianEmail = clinician?.user?.email;

    const [showEditEmail, setEditEmail] = useState(false);
    const [showChangePassword, setChangePassword] = useState(false);
    const [email, setEmail] = useState<string>(clinicianEmail);
    const [currPassword, setCurrPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();


    // When user logs out
    async function onLogOut() {
        await UseAPI.logout();
    }

    // When user clicks on their email
    function onEditEmail() {
        setEditEmail(true);
    }

    // When user clicks on 'Change Password'
    function onChangePassword() {
        setChangePassword(true);
    }

    // When user clicks on 'Terms of Service'
    function termsOfService() {
        history.push("/terms-of-service");
    }

    // When user clicks 'Edit Email' in the edit email modal
    async function editEmail() {
        console.log(email)
        try {
            clinician.user.email = email;
            clinician = await UseAPI.updateClinician(clinician);
            setEditEmail(false);
        } catch (e) {
            console.error(e);
        }
    }

    // When user clicks 'Change Password' in the change password modal
    async function changePassword() {
        console.log(currPassword, newPassword);
        try {
            await UseAPI.changePassword(currPassword, newPassword);
            setChangePassword(false);
        } catch (e) {
            console.error(e);
        }
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
                            editEmail={onEditEmail}
                            changePassword={onChangePassword}
                            viewTermsOfService={termsOfService}
                            onLogOut={onLogOut}
                        />
                    </div>
                </IonContent>
            </IonPage>
            <IonModal isOpen={showEditEmail} cssClass="clinician-modal" onDidDismiss={() => setEditEmail(false)}>
                <EditEmail email={email} setEmail={setEmail} save={editEmail}/>
            </IonModal>
            <IonModal isOpen={showChangePassword} cssClass="clinician-modal"
                      onDidDismiss={() => setChangePassword(false)}>
                <ChangePassword currPassword={currPassword} setCurrPassword={setCurrPassword} newPassword={newPassword}
                                setNewPassword={setNewPassword} save={changePassword}/>
            </IonModal>
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
