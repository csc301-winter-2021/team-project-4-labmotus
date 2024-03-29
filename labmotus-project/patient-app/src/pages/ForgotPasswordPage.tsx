import {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonToolbar} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import API, {getAPIContext} from "../api/API";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import {useHistory} from "react-router";
import ForgotPassword from "../../../common/ui/pages/ForgotPassword";
import {chevronBack} from "ionicons/icons";

export interface ForgotPasswordPageProps {
}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme: Theme = useContext(getThemeContext());
    const history = useHistory();

    const [email, setEmail] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    // When user clicks 'Back'
    function back() {
        history.push(`/login`);
    }

    // When user clicks 'Forgot Password?'¬
    async function forgotPassword() {
        if (!email) {
            setHeader("Invalid Email");
            setMessage("Please enter your email.");
            openAlert(true);
            return;
        }
        try {
            const forgotPassResult = await UseAPI.forgotPassword(email);
            switch (forgotPassResult) {
                case "invalid-email":
                    // User has entered an invalid email address
                    setHeader("Invalid Email");
                    setMessage("Please enter a valid email address.");
                    openAlert(true);
                    return;
                case "user-not-found":
                    // There is no user corresponding to the given email
                    setHeader("Invalid Email");
                    setMessage(
                        "The email you have entered is not associated with an account. Please try again or sign up for an account."
                    );
                    openAlert(true);
                    return;
                case "success":
                    // User has entered valid email
                    setHeader("Password Reset Email Sent");
                    setMessage("Please check your email to reset your password!");
                    openAlert(true);
                    return;
                default:
                    console.log(forgotPassResult);
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <BackButtonDiv theme={theme}>
                            <IonButtons slot="start" onClick={back}>
                                <IonIcon icon={chevronBack}/>
                                Back
                            </IonButtons>
                        </BackButtonDiv>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <ForgotPassword email={email} setEmail={setEmail} onForgotPassword={forgotPassword}/>
                </IonContent>
            </IonPage>
            <IonAlert
                isOpen={isError}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </div>
    );
};

const BackButtonDiv = styled.div`
  ion-buttons {
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    cursor: pointer;

    ion-icon {
      height: 25px;
      width: 25px;
    }
  }
`;

export default ForgotPasswordPage;
