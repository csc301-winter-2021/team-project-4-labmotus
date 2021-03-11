import React, { FunctionComponent, useContext, useState } from "react";
import {
    IonAlert,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonPage,
    IonToolbar,
} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import API, { getAPIContext } from "../api/API";
import { Theme, getThemeContext } from "../../../common/ui/theme/Theme";
import { useHistory } from "react-router";
import { chevronBack } from "ionicons/icons";

export interface ForgotPasswordPageProps {}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = () => {
    const theme: Theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();

    const [email, setEmail] = useState<string>();
    const [iserror, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

	// When user clicks 'Forgot Password?'
    async function forgotPassword() {
        if (!email) {
            setHeader("Invalid Email");
            setMessage("Please enter your email.");
            openAlert(true);
            return;
        }
        try {
            await UseAPI.forgotPassword(email);
        } catch (e) {
            console.error(e);
        }
    }

	// When user clicks 'Back'
    function back() {
        history.push(`/login`);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <BackButtonDiv theme={theme}>
                        <IonButtons slot="start" onClick={back}>
                            <IonIcon icon={chevronBack} />
                            Back
                        </IonButtons>
                    </BackButtonDiv>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <ForgotPasswordPageDiv theme={theme}>
                    <h1>Reset Password</h1>
                    <div className="main-padding">
                        <div className="main">
                            <p>
                                Enter the email address you used to register and we'll send you the instructions for
                                resetting your password.
                            </p>
                            <IonInput
                                class="input"
                                placeholder="Email"
                                type="email"
                                clearInput={true}
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            />
                            <IonButton expand="block" shape="round" onClick={forgotPassword}>
                                Submit
                            </IonButton>
                        </div>
                    </div>
                </ForgotPasswordPageDiv>
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

const ForgotPasswordPageDiv = styled.div`
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
            margin-bottom: 5%;
            text-align: left;
            border-radius: 5px;
            border: 1px solid #ddd;
            --padding-start: 10px;
        }
        pointer-events: none;
    }
    .main {
        height: 100%;
        width: 100%;
        .input {
            margin-bottom: 5%;
            text-align: left;
            border-radius: 5px;
            border: 1px solid #ddd;
            --padding-start: 10px;
        }
        pointer-events: auto;
    }
    h1 {
        font-weight: bold;
        margin-top: 15vh;
    }
`;

const BackButtonDiv = styled.div`
    ion-buttons {
        color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
        cursor: pointer;
        ion-icon {
            height: 25px;
            width: 25px;
        }
    }
`;

export default ForgotPasswordPage;
