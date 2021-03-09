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
import { Theme, ThemeContext } from "../theme/Theme";
import { APIContext } from "../api/API";
import { useHistory } from "react-router";
import { chevronBack } from "ionicons/icons";
import { Patient } from "../../../common/types/types";

export interface EditPhonePageProps {}

const EditPhonePage: FunctionComponent<EditPhonePageProps> = () => {
    const theme = useContext(ThemeContext);
    const API = useContext(APIContext);
    const patient: Patient = API.getCurrentUser();
    const history = useHistory();

    const patientNumber = patient?.phone;

    const [phoneNumber, setPhoneNumber] = useState<string>(patientNumber.split("-").join(""));

    async function editPhoneNumber() {
        const phone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        alert("new number is " + phone);
        try {
            // await API.changePhoneNumber(phone);
            history.push(`/settings`);
        } catch (e) {
            console.error(e);
        }
    }

    function back() {
        history.push(`/settings`);
    }

    return (
        <EditPhonePageDiv theme={theme}>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={back}>
                            <IonIcon icon={chevronBack} />
                            Back
                        </IonButtons>
                        <IonButtons slot="end" onClick={editPhoneNumber}>
                            Save
                        </IonButtons>
                        <IonTitle>Edit Phone Number</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonInput
                        type="tel"
                        autofocus={true}
                        value={phoneNumber}
                        minlength={10}
                        maxlength={10}
                        onIonChange={(e) => setPhoneNumber(e.detail.value!)}
                    ></IonInput>
                </IonContent>
            </IonPage>
        </EditPhonePageDiv>
    );
};

const EditPhonePageDiv = styled.div`
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

export default EditPhonePage;
