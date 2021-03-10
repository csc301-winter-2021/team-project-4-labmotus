import { FunctionComponent, useContext, useState } from "react";
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import { Theme, getThemeContext } from "../../../common/ui/theme/Theme";
import { APIContext } from "../api/API";
import { useHistory } from "react-router";
import { chevronBack } from "ionicons/icons";
import { Patient } from "../../../common/types/types";

export interface EditEmailPageProps {}

const EditEmailPage: FunctionComponent<EditEmailPageProps> = () => {
    const theme = useContext(getThemeContext());
    const API = useContext(APIContext);
    const patient: Patient = API.getCurrentUser();
    const history = useHistory();

    const patientEmail = patient?.user?.email;

    const [email, setEmail] = useState<string>(patientEmail);

    async function editEmail() {
        alert("new email is " + email);
        try {
            // await API.changeEmail(email);
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
                            <IonIcon icon={chevronBack} />
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
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                    ></IonInput>
                </IonContent>
            </IonPage>
        </EditEmailPageDiv>
    );
};

const EditEmailPageDiv = styled.div`
    overflow: hidden;
    width: 100%;
    height: 100%;
    ion-input {
        background-color: ${({ theme }: { theme: Theme }) => theme.colors.light};
    }
    ion-buttons {
        color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
        cursor: pointer;
        ion-icon {
            height: 25px;
            width: 25px;
        }
    }
`;

export default EditEmailPage;
