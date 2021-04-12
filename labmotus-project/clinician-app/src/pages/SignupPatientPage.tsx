import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {DateDisplay} from "../../../common/ui/components/DateDisplay";
import API from "../api/API";
import moment, {Moment} from "moment";
import {Patient} from "../../../common/types/types";
import {useHistory} from "react-router";
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

    const history = useHistory();

    // When user clicks 'Back'
    function back() {
        history.goBack();
    }

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
        if (!email || !validEmail.test(email.toLowerCase())) {
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
                // TODO REPLACE WITH CURRENT CLINICIAN'S ID + ADD PATIENT TO THE LIST
                clinicianID: "",
                birthday: birthday,
                phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
                incomplete: true,
            };

            // Add patient to database
            await UseAPI.createPatient(patient);
            setHeader("Account Added");
            setMessage("A confirmation email will be sent to the patient shortly.");
            openAlert(true);
            setName("");
            setEmail("");
            setBirthday(moment());
            setPhone("");
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <IonPage>
            <Header onBackClick={back}/>
            <IonContent fullscreen>
                <SignupPatientPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <CenterWrapper className="wrapper">
                        <div className="form">
                            <IonInput
                                class="input"
                                placeholder="Full Name"
                                type="text"
                                value={name}
                                onIonChange={(e) => setName(e.detail.value!)}
                            />
                            <div>
                                <span>Birthday:</span>
                                <DateDisplay date={birthday} changeDay={setBirthday} displayFormat={"YYYY-MM-DD"}/>
                            </div>
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
    margin-bottom: 10px;
    text-align: left;
    border-radius: 5px;
    border: 1px solid #ddd;
    --padding-start: 10px;
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

  .wrapper {
    top: 55%;
  }

  h1 {
    font-weight: bold;
    margin-top: 10vh;
  }

  h3 {
    margin-top: 0;
  }

  .footer {
    margin-top: 65vh;
  }

  span {
    cursor: pointer;
  }
`;

export default SignupPatientPage;
