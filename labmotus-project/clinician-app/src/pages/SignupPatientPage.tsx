import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {DateDisplay} from "../components/DateDisplay";
import API, {getAPIContext} from "../api/API";
import moment, {Moment} from "moment";
import {Clinician, Patient} from "../../../common/types/types";

export interface SignupPatientPageProps {
}

const SignupPatientPage: FunctionComponent<SignupPatientPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const [email, setEmail] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [name, setName] = useState<string>();
    const [iserror, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [birthday, setBirthday] = useState<Moment>(moment());

    // When user signs up for an account
    async function signUp() {
        console.log("email", email, "phone", phone, "name", name);
        if (!email) {
            setHeader("Invalid Email");
            setMessage("Please enter patient's email.");
            openAlert(true);
            return;
        }
        if (!phone) {
          setHeader("Invalid Phone Number");
          setMessage("Please enter patient's phone number.");
          openAlert(true);
          return;
        }
        if (!name) {
          setHeader("Invalid Name");
          setMessage("Please enter patient's full name.");
          openAlert(true);
          return;
        }

        try {

        // create patient
            const clinician: Clinician = await UseAPI.getClinician();
            const patientId = "1234";
            const patient: Patient = {
              user: {
                  email: email,
                  id: patientId,
                  name: name,
              },
              clinicianID: clinician.user.id,
              birthday: birthday,
              phone: phone,
              incomplete: true,
            };

            // add patient to database
            await UseAPI.createPatient(patient);

        } catch (e) {
            console.error(e);
        }
    }

    //

    return (
        <IonPage>
            <IonContent fullscreen>
                <SignupPatientPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <div className="main-padding">
                        <div className="main">
                            <form>
                                <IonInput
                                    class="input"
                                    placeholder="Full Name"
                                    type="text"
                                    clearInput={true}
                                    value={name}
                                    onIonChange={(e) => setName(e.detail.value!)}
                                />
                                <div>
                                    <span>Birthday:</span>
                                    <DateDisplay
                                        date={birthday}
                                        changeDay={setBirthday}
                                    />
                                </div>
                                <IonInput
                                    class="input"
                                    placeholder="Email"
                                    type="email"
                                    clearInput={true}
                                    value={email}
                                    onIonChange={(e) => setEmail(e.detail.value!)}
                                />
                                <IonInput
                                    class="input"
                                    placeholder="Phone Number"
                                    type="tel"
                                    clearInput={true}
                                    value={phone}
                                    onIonChange={(e) => setPhone(e.detail.value!)}
                                />
                                <button className="signup-button" onClick={signUp}>
                                    Send confirmation email to patient
                                </button>
                            </form>
                        </div>
                    </div>
                </SignupPatientPageDiv>
            </IonContent>
            <IonAlert
                isOpen={iserror}
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

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;

    .input {
      margin-bottom: 10px;
      text-align: left;
      border-radius: 5px;
      border: 1px solid #ddd;
      --padding-start: 10px;
    }

    .signup-button {
      width: 100%;
      border-radius: 25px;
      max-width: 490px;
      font-size: 0.8em;
      padding: 14px;
      font-weight: 500;
      outline: none;
      box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
      background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
      color: white;
    }

    @media only screen and (min-width: 768px) {
      form {
        margin: 0 auto;
        max-width: 60vw;
      }

      .signup-button {
        font-size: 1.1em;
      }
    }
    @media only screen and (min-width: 1024px) {
      form {
        max-width: 40vw;
      }
    }
    pointer-events: none;
  }

  .main {
    height: 100%;
    width: 100%;
    pointer-events: auto;
  }

  h1 {
    font-weight: bold;
    margin-top: 15vh;
  }

  .footer {
    margin-top: 65vh;
  }

  span {
    cursor: pointer;
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
  }
`;

export default SignupPatientPage;
