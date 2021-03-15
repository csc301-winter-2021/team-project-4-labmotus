import {FunctionComponent, useContext, useState} from "react";
import {IonAlert} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import {useHistory} from "react-router";
import API, {getAPIContext} from "../api/API";
import ForgotPassword from "../../../common/ui/pages/ForgotPassword";

export interface ForgotPasswordPageProps {
}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = useContext(getThemeContext());
    const history = useHistory();


    const [email, setEmail] = useState<string>();
    const [iserror, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

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

    // When user clicks 'Login'
    function login() {
        history.push(`/login`);
    }

    return (
        <ForgotPasswordPageDiv theme={theme}>
            <h1>LabMotus</h1>
            <h3>Clinician Portal</h3>
            <ForgotPassword email={email} setEmail={setEmail} onForgotPassword={forgotPassword}/>
            <p className="footer">Remember your password? <span onClick={login}>Login</span></p>
            <IonAlert
                isOpen={iserror}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </ForgotPasswordPageDiv>
    );
};

const ForgotPasswordPageDiv = styled.div`
  overflow: hidden;
  text-align: center;

  h1 {
    font-weight: bold;
    margin-top: 10vh;
  }

  .footer {
    margin-top: 55vh;
  }

  span {
    cursor: pointer;
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
  }
`;

export default ForgotPasswordPage;
