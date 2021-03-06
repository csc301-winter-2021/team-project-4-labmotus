import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonButton, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {APIContext} from "../api/API";
import {useHistory} from "react-router";

export interface SignupPageProps {
}

const SignupPage: FunctionComponent<SignupPageProps> = () => {
	const API = useContext(APIContext);
	const history = useHistory();
	const [email, setEmail] = useState<string>();
	const [password, setPassword] = useState<string>();
	const [confirmPassword, setConfirmPassword] = useState<string>();
	const [iserror, openAlert] = useState<boolean>(false);
	const [header, setHeader] = useState<string>();
	const [message, setMessage] = useState<string>();

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
			return;
		}

		try {
			await API.signUp(email, password);
			history.push('/home');
		} catch (e) {
			console.error(e);
		}
	}

	function login() {
		history.push('/login');
	}

  return (
    <IonPage>
		<IonContent fullscreen>
			<SignupPageDiv>
				<h1>LabMotus</h1>
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
						By clicking 'Sign Up' you agree to our <a>Terms of Service</a>
					</p>
				</div>
				<p className="footer">
					Already have an account? <a onClick={login}>Login</a>
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
.main {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		padding: 5%;
		.input {
			margin-bottom: 5%;
			text-align: left;
			border-radius: 5px;
			border: 1px solid #ddd;
			--padding-start: 10px;
		}
}
h1 {
		font-weight: bold;
		margin-top: 15vh;
}
.footer {
		margin-top: 65vh;
}
a {
		text-decoration: none;
}
`;

export default SignupPage;
