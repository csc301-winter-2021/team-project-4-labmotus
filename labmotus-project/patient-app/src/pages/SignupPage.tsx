import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonButton, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import {APIContext} from "../api/API";
import {useHistory} from "react-router";

export interface SignupPageProps {
}

const SignupPage: FunctionComponent<SignupPageProps> = () => {
	const API = useContext(APIContext);
	const theme = React.useContext(getThemeContext());

	const history = useHistory();
	const [email, setEmail] = useState<string>();
	const [password, setPassword] = useState<string>();
	const [confirmPassword, setConfirmPassword] = useState<string>();
	const [iserror, openAlert] = useState<boolean>(false);
	const [header, setHeader] = useState<string>();
	const [message, setMessage] = useState<string>();

	// When user signs up for an account
	async function signUp() {
		if (!email) {
			setHeader("Invalid Email");
			setMessage("Please enter your email.");
			openAlert(true);
			return;
		}

		if (!password) {
			setHeader("Invalid Password");
			setMessage("Please enter a password.");
			openAlert(true);
			return;
		}

		if (password !== confirmPassword) {
			setHeader("Passwords Don't Match");
			setMessage("The passwords don't match. Please try again.");
			openAlert(true);
			setConfirmPassword("");
			return;
		}

		try {
			await API.signUp(email, password);
		} catch (e) {
			console.error(e);
		}
	}

	// When user clicks 'Login'
	function login() {
		history.push('/login');
	}

  return (
    <IonPage>
		<IonContent fullscreen>
			<SignupPageDiv theme={theme}>
                <h1>LabMotus</h1>
                <div className="main-padding">
                    <div className="main">
                        <form>
                            <IonInput
                                class="input email"
                                placeholder="Email"
                                type="email"
                                inputmode="email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            />
                            <IonInput
								class="input password"
								placeholder="Password"
								type="password"
								value={password}
								onIonChange={(e) => setPassword(e.detail.value!)}
								/>
							<IonInput
								class="input password"
								placeholder="Confirm Password"
								type="password"
								value={confirmPassword}
								onIonChange={(e) => setConfirmPassword(e.detail.value!)}
							/>
                            <IonButton expand="block" shape="round" onClick={signUp}>
                                Sign Up
                            </IonButton>
                        </form>
                        <p>
                            By clicking 'Sign Up' you agree to our <span>Terms of Service</span>
                        </p>
                    </div>
                </div>
                <p className="footer">
                    Already have an account? <span onClick={login}>Login</span>
                </p>
			</SignupPageDiv>
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

const SignupPageDiv = styled.div`
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
	.footer {
		margin-top: 65vh;
	}
	span {
		cursor: pointer;
		color: ${({theme}: { theme: Theme }) => theme.colors.primary};
	}
`;

export default SignupPage;
