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
import EditName from "../components/EditName";
import EditClinic from "../components/EditClinic";

export interface SettingsPageProps {
}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();

    let clinician: Clinician = UseAPI.getCurrentUser();

    const [showEditName, setEditName] = useState(false);
    const [showEditClinic, setEditClinic] = useState(false);
    const [showEditEmail, setEditEmail] = useState(false);
    const [showChangePassword, setChangePassword] = useState(false);

    const [name, setName] = useState<string>(clinician?.user?.name);
    const [clinicName, setClinicName] = useState<string>(clinician?.clinic);
    const [email, setEmail] = useState<string>(clinician?.user?.email);
    const [currPassword, setCurrPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();

    const [redirectLogout, openRedirectLogout] = useState<boolean>(false);
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    // When user logs out
    async function onLogOut() {
        await UseAPI.logout();
    }

    // When user clicks on their name
    function onEditName() {
        setName(clinician?.user?.name);
        setEditName(true);
    }

    // When user clicks on the clinic name
    function onEditClinic() {
        setClinicName(clinician?.clinic);
        setEditClinic(true);
    }

    // When user clicks on their email
    function onEditEmail() {
        setEmail(clinician?.user?.email);
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

    // When user clicks 'Edit Name' in the edit name modal
    async function editName() {
        // Check if user has entered a valid email
        if (!name) {
            setHeader("Invalid Name");
            setMessage("Please enter your full name.");
            openAlert(true);
            return;
        }
        try {
            clinician.user.name = name;
            clinician = await UseAPI.updateClinician(clinician);
        } catch (e) {
            console.error(e);
        } finally {
            setEditName(false);
        }
    }

    // When user clicks 'Edit Clinic Name' in the edit name modal
    async function editClinic() {
        // Check if user has entered a valid email
        if (!clinicName) {
            setHeader("Invalid Name");
            setMessage("Please enter your the clinic's name.");
            openAlert(true);
            return;
        }
        try {
            clinician.clinic = clinicName;
            clinician = await UseAPI.updateClinician(clinician);
        } catch (e) {
            console.error(e);
        } finally {
            setEditClinic(false);
        }
    }

    // When user clicks 'Edit Email' in the edit email modal
    async function editEmail() {
        // Check if user has entered a valid email
        const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!validEmail.test(email.toLowerCase())) {
            setHeader("Invalid Email");
            setMessage("Please enter a valid email address.");
            openAlert(true);
            return;
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
            setConfirmPassword("");
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
            const changePassResult = await UseAPI.changePassword(currPassword, newPassword);
            switch (changePassResult) {
                case "success":
                    openRedirectLogout(true);
                    return;
                case "wrong-password":
                    // User has entered the wrong current password
                    setHeader("Incorrect Password");
                    setMessage("The current password you entered is incorrect. Please try again.");
                    openAlert(true);
                    setNewPassword("");
                    setConfirmPassword("");
                    return;
                case "weak-password":
                    // User chose a new weak password under 6 characters
                    setHeader("Weak Password");
                    setMessage("Please choose a new password that's at least 6 characters.");
                    openAlert(true);
                    setNewPassword("");
                    setConfirmPassword("");
                    return;
                default:
                    setHeader("Error");
                    setMessage("An error has occurred while changing your password. Please try again later.");
                    openAlert(true);
                    console.log(changePassResult);
                    return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <SettingsPageDiv>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal: Settings</h3>
                    <div className="settings">
                        <SettingsList
                            patient={false}
                            name={clinician?.user?.name}
                            editName={onEditName}
                            clinic={clinician?.clinic}
                            editClinic={onEditClinic}
                            birthday={null}
                            email={clinician?.user?.email}
                            editEmail={onEditEmail}
                            phone=""
                            editPhone={(): void => null}
                            changePassword={onChangePassword}
                            viewTermsOfService={termsOfService}
                            onLogOut={onLogOut}
                        />
                    </div>
                    <IonModal isOpen={showEditName} onDidDismiss={() => setEditName(false)}>
                        <EditName name={name} setName={setName} setEditName={setEditName} save={editName}/>
                    </IonModal>
                    <IonModal isOpen={showEditClinic} onDidDismiss={() => setEditClinic(false)}>
                        <EditClinic clinic={clinicName} setClinic={setClinicName} setEditClinic={setEditClinic}
                                    save={editClinic}/>
                    </IonModal>
                    <IonModal isOpen={showEditEmail} onDidDismiss={() => setEditEmail(false)}>
                        <EditEmail email={email} setEmail={setEmail} setEditEmail={setEditEmail} save={editEmail}/>
                    </IonModal>
                    <IonModal isOpen={showChangePassword} onDidDismiss={() => setChangePassword(false)}>
                        <ChangePassword
                            currPassword={currPassword}
                            setCurrPassword={setCurrPassword}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            setChangePassword={setChangePassword}
                            save={changePassword}
                        />
                    </IonModal>
                    <IonAlert
                        isOpen={redirectLogout}
                        onDidDismiss={() => {
                            openRedirectLogout(false);
                            onLogOut();
                        }}
                        header="Password Changed"
                        message="Your password has been successfully changed."
                        buttons={["OK"]}
                    />
                    <IonAlert
                        isOpen={isError}
                        onDidDismiss={() => openAlert(false)}
                        header={header}
                        message={message}
                        buttons={["OK"]}
                    />
                </SettingsPageDiv>
            </IonContent>
        </IonPage>
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
