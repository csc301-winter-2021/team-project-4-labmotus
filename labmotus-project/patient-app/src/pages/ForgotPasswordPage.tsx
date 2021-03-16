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
    const [iserror, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    // When user clicks 'Back'
    function back() {
        history.push(`/login`);
    }

    // When user clicks 'Forgot Password?'
    async function forgotPassword() {
        console.log(email, "the email");
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

    return (
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
                <IonAlert
                    isOpen={iserror}
                    onDidDismiss={() => openAlert(false)}
                    header={header}
                    message={message}
                    buttons={["OK"]}
                />
            </IonContent>
        </IonPage>
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
