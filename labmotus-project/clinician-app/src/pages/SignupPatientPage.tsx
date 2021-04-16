import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {DateDisplay} from "../../../common/ui/components/DateDisplay";
import API from "../api/API";
import moment, {Moment} from "moment";
import {Patient} from "../../../common/types/types";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Button from "../../../common/ui/components/Button";
import Header from "../../../common/ui/components/Header"
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface SignupPatientPageProps {
}

const SignupPatientPage: FunctionComponent<SignupPatientPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [birthday, setBirthday] = useState<Moment>(moment());
    const [phone, setPhone] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    // When user signs patient up for an account
    async function signUpPatient() {
        // Check if user has entered a name
        if (!name) {
            setHeader("Invalid Name");
            setMessage("Please enter the patient's full name.");
            openAlert(true);
            return;
        }
        // Check if user has entered a valid email
        const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email || !validEmail.test(email)) {
            setHeader("Invalid Email");
            setMessage("Please enter a valid email address for the patient.");
            openAlert(true);
            return;
        }
        // Check if user has entered a valid phone number
        const validNumber = /^\d{10}$/;
        if (!phone || !validNumber.test(phone)) {
            setHeader("Invalid Phone Number");
            setMessage("Please enter a valid phone number for the patient. The phone number should be 10 numbers.");
            openAlert(true);
            return;
        }
        try {
            // Create patient
            const patient: Patient = {
                user: {
                    email: email,
                    id: "",
                    name: name,
                },
                clinicianID: "",
                birthday: birthday,
                phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
                incomplete: true,
            };

            // Add patient to database
            const createPatientResult = await UseAPI.createPatient(patient);
            switch (createPatientResult) {
                case "success":
                    setHeader("Account Added");
                    setMessage("A confirmation email will be sent to the patient shortly.");
                    openAlert(true);
                    setName("");
                    setEmail("");
                    setBirthday(moment());
                    setPhone("");
                    return;
                case "Creation Failed":
                    // Usually the case that the email was invalid or in use
                    setHeader("Invalid Email");
                    setMessage("The email you have entered is invalid or already has an account associated with it. Please enter a different email.");
                    openAlert(true);
                    return;
                case "Forbidden":
                    // Patient tried to create a new patient
                    setHeader("Forbidden");
                    setMessage("This operation is not allowed. Only clinicians can create patients.");
                    setName("");
                    setEmail("");
                    setBirthday(moment());
                    setPhone("");
                    openAlert(true);
                    return;
                default:
                    setHeader("Error");
                    setMessage("An error has occurred while trying to sign up the patient. Please try again later.");
                    openAlert(true);
                    console.log(createPatientResult)
                    return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <IonPage>
            <Header onBackClick/>
            <IonContent fullscreen>
                <SignupPatientPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <CenterWrapper>
                        <div className="form">
                            <IonInput
                                class="input"
                                placeholder="Full Name"
                                type="text"
                                value={name}
                                onIonChange={(e) => setName(e.detail.value!)}
                            />
                            <IonInput
                                class="input"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            />
                            <IonInput
                                class="input"
                                placeholder="Phone Number"
                                type="tel"
                                value={phone}
                                onIonChange={(e) => setPhone(e.detail.value!)}
                            />
                            Birthday:
                            <DateDisplay date={birthday} changeDay={setBirthday} displayFormat={"YYYY-MM-DD"}/>
                            <Button label="Send Confirmation Email to Patient" onClick={signUpPatient}
                                    type="primary round"/>
                        </div>
                    </CenterWrapper>
                </SignupPatientPageDiv>
            </IonContent>
            <IonAlert
                isOpen={isError}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </IonPage>
    );
};

const SignupPatientPageDiv = styled.div`
  overflow: hidden;
  text-align: center;

  .input {
    text-align: left;
    border: 1px solid ${({theme}: { theme: Theme }) => theme.colors.shade};
    --padding-start: 10px;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  @media only screen and (min-width: 768px) {
    .form {
      margin: 0 auto;
      max-width: 60vw;
    }
  }
  @media only screen and (min-width: 1024px) {
    .form {
      max-width: 40vw;
    }
  }

  h1 {
    font-weight: bold;
    margin-top: 10vh;
  }

  h3 {
    margin-top: 0;
  }
`;

export default SignupPatientPage;
