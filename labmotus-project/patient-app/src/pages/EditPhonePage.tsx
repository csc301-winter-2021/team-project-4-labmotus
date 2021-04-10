import React, {FunctionComponent, useContext, useState} from "react";
import {
    IonAlert,
    IonContent,
    IonHeader,
    IonInput,
    IonPage,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import Toolbar from "../../../common/ui/components/Toolbar"
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API from "../api/API";
import {useHistory} from "react-router";
import {Patient} from "../../../common/types/types";
import {getAPIContext} from "../../../common/api/BaseAPI";

export interface EditPhonePageProps {
}

const EditPhonePage: FunctionComponent<EditPhonePageProps> = () => {
    const theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());
    let patient: Patient = UseAPI.getCurrentUser();
    const history = useHistory();

    const patientNumber = patient?.phone;

    const [phoneNumber, setPhoneNumber] = useState<string>(patientNumber.split("-").join(""));
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    async function editPhoneNumber() {
        // Check if user has entered a valid phone number
        const validNumber = /^\d{10}$/;
        if (!validNumber.test(phoneNumber)) {
            setHeader("Invalid Phone Number");
            setMessage("Please enter a valid phone number. The phone number should be 10 numbers.");
            openAlert(true);
            return;
        }
        try {
            patient.phone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
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
        <EditPhonePageDiv theme={theme}>
            <IonPage>
                <IonHeader>
                    <Toolbar onBackClick={back} onSaveClick={editPhoneNumber} title="Edit Phone Number"/>
                </IonHeader>
                <IonContent>
                    <IonInput
                        type="tel"
                        autofocus={true}
                        clearInput={true}
                        value={phoneNumber}
                        minlength={10}
                        maxlength={10}
                        onIonChange={(e) => setPhoneNumber(e.detail.value!)}
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
        </EditPhonePageDiv>
    );
};

const EditPhonePageDiv = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;

  ion-input {
    text-align: center;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }
`;

export default EditPhonePage;
