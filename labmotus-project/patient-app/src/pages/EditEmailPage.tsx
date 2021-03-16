import {FunctionComponent, useContext, useState} from "react";
import {
    IonAlert,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import API, {getAPIContext} from "../api/API";
import {useHistory} from "react-router";
import {chevronBack} from "ionicons/icons";
import {Patient} from "../../../common/types/types";

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
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={back}>
                            <IonIcon icon={chevronBack}/>
                            Back
                        </IonButtons>
                        <IonButtons slot="end" onClick={editEmail}>
                            Save
                        </IonButtons>
                        <IonTitle>Edit Email</IonTitle>
                    </IonToolbar>
                </IonHeader>
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

  ion-buttons {
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    cursor: pointer;

    ion-icon {
      height: 25px;
      width: 25px;
    }
  }
`;

export default EditEmailPage;
