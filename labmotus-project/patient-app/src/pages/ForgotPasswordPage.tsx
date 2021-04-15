import {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import API from "../api/API";
import ForgotPassword from "../../../common/ui/pages/ForgotPassword";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Header from "../../../common/ui/components/Header";

export interface ForgotPasswordPageProps {
}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());

    const [email, setEmail] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

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
                case "success":
                    setHeader("Password Reset Email Sent");
                    setMessage("Please check your email to reset your password!");
                    openAlert(true);
                    setEmail("");
                    return;
                case "invalid-email":
                    // User has entered an invalid email address
                    setHeader("Invalid Email");
                    setMessage("Please enter a valid email address.");
                    openAlert(true);
                    return;
                case "user-not-found":
                    // There is no user corresponding to the given email
                    setHeader("Invalid Email");
                    setMessage("The email you have entered is not associated with an account. Please try again or sign up for an account.");
                    openAlert(true);
                    return;
                default:
                    setHeader("Error");
                    setMessage("An error has occurred sending a password reset email. Please try again later.");
                    openAlert(true);
                    console.log(forgotPassResult);
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
                <ForgotPassword email={email} setEmail={setEmail} onForgotPassword={forgotPassword}/>
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

export default ForgotPasswordPage;
