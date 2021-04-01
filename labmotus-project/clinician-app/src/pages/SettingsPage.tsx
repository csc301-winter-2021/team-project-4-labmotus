import {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonModal, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import API from "../api/API";
import {Clinician} from "../../../common/types";
import SettingsList from "../../../common/ui/components/SettingsList";

import {useHistory} from "react-router";
import EditEmail from "../components/EditEmail";
import ChangePassword from "../components/ChangePassword";
import {getAPIContext} from "../../../common/api/BaseAPI";

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
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

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
        // Check if user has entered a valid email
        const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!validEmail.test(email.toLowerCase())) {
            setHeader("Invalid Email");
            setMessage("Please enter a valid email address.");
            openAlert(true);
        }
        try {
            clinician.user.email = email;
            clinician = await UseAPI.updateClinician(clinician);
        } catch (e) {
            console.error(e);
        } finally {
            setEditEmail(false);
        }
    }

    // When user clicks 'Change Password' in the change password modal
    async function changePassword() {
        if (!currPassword || !newPassword || !confirmPassword) {
            setHeader("Invalid Password");
            setMessage("Please enter your current password and set a new one.");
            openAlert(true);
            return;
        }
        if (newPassword !== confirmPassword) {
            setHeader("Passwords Don't Match");
            setMessage("The passwords don't match. Please try again.");
            openAlert(true);
            return;
        }
        if (currPassword === newPassword) {
            setHeader("Change Password");
            setMessage("The new password you entered is the same as your old one. Please enter a different password.");
            openAlert(true);
            setNewPassword("");
            setConfirmPassword("");
            return;
        }
        try {
            const pass = await UseAPI.changePassword(currPassword, newPassword);
            console.log(pass, "testing in change password for clinician");
        } catch (e) {
            console.error(e);
        } finally {
            setChangePassword(false);
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
                            birthday={null} editPhone={(): void => null} phone=""/>
                    </div>
                </IonContent>
            </IonPage>
            <IonModal isOpen={showEditEmail} cssClass="clinician-modal" onDidDismiss={() => setEditEmail(false)}>
                <EditEmail email={email} setEmail={setEmail} setEditEmail={setEditEmail} save={editEmail}/>
            </IonModal>
            <IonModal isOpen={showChangePassword} cssClass="clinician-modal"
                      onDidDismiss={() => setChangePassword(false)}>
                <ChangePassword currPassword={currPassword} setCurrPassword={setCurrPassword} newPassword={newPassword}
                                setNewPassword={setNewPassword} confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword} setChangePassword={setChangePassword}
                                save={changePassword}/>
            </IonModal>
            <IonAlert
                isOpen={isError}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
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
