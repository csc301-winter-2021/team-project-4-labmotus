import {FunctionComponent, useContext, useState} from "react";
import {
    IonAlert,
    IonContent,
    IonInput,
    IonPage,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API from "../api/API";
import {useHistory} from "react-router";
import {Patient} from "../../../common/types/types";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Header from "../../../common/ui/components/Header"

export interface EditEmailPageProps {
}

const EditEmailPage: FunctionComponent<EditEmailPageProps> = () => {
    const theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());
    let patient: Patient = UseAPI.getCurrentUser();
    const history = useHistory();

    const patientEmail = patient?.user?.email;

    const [email, setEmail] = useState<string>(patientEmail);
    const [currPassword, setCurrPassword] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    async function editEmail() {
        if (!email) {
            setHeader("Invalid Email");
            setMessage("Please enter your new email address.");
            openAlert(true);
            return;
        }
        if (!currPassword) {
            setHeader("Invalid Password");
            setMessage("Please enter your current password.");
            openAlert(true);
            return;
        }
        try {
            if (patient.user.email === email) {
                history.goBack();
                return;
            }
            const changeEmailResult = await UseAPI.changeEmail(email, currPassword);
            switch (changeEmailResult) {
                case "success":
                    patient.user.email = email;
                    patient = await UseAPI.updatePatient(patient);
                    history.goBack();
                    return;
                case "invalid-email":
                    // User has entered an invalid email address
                    setHeader("Invalid Email");
                    setMessage("Please enter a valid email address.");
                    openAlert(true);
                    return;
                case "wrong-password":
                    // User has entered the wrong current password
                    setHeader("Incorrect Password");
                    setMessage("The current password you entered is incorrect. Please try again.");
                    openAlert(true);
                    setCurrPassword("");
                    return;
                default:
                    setHeader("Error");
                    setMessage("An error has occurred while changing your email. Please try again later.");
                    openAlert(true);
                    console.log(changeEmailResult);
                    return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <EditEmailPageDiv theme={theme}>
            <IonPage>
                <Header onBackClick onSaveClick={editEmail} title="Edit Email"/>
                <IonContent>
                    <IonInput
                        type="email"
                        autofocus={true}
                        clearInput={true}
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                    />
                    <IonInput
                        type="password"
                        placeholder="Current Password"
                        value={currPassword}
                        onIonChange={(e) => setCurrPassword(e.detail.value!)}
                    />
                </IonContent>
            </IonPage>
            <IonAlert
                isOpen={isError}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </EditEmailPageDiv>
    );
};

const EditEmailPageDiv = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;

  ion-input {
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
    --padding-start: 10px;
  }

`;

export default EditEmailPage;
