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
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

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
            patient.user.email = email;
            patient = await UseAPI.updatePatient(patient);
            history.push(`/settings`);
        } catch (e) {
            console.error(e);
        }
    }

    function back() {
        history.push(`/settings`);
    }

    return (
        <EditEmailPageDiv theme={theme}>
            <IonPage>
                <Header onBackClick={back} onSaveClick={editEmail} title="Edit Email"/>                
                <IonContent>
                    <IonInput
                        type="email"
                        autofocus={true}
                        clearInput={true}
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
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
    text-align: center;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

`;

export default EditEmailPage;
