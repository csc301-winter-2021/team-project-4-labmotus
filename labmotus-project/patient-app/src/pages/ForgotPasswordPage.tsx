import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonPage, IonToolbar} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {APIContext} from "../api/API";

export interface ForgotPasswordPageProps {
}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = () => {
    const API = useContext(APIContext);
    const [email, setEmail] = useState<string>();
    const [iserror, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    async function forgotPassword() {
        if (!email) {
            setHeader("Invalid Email");
            setMessage("Please enter your email.");
            openAlert(true);
            return;
        }
        try {
            await API.forgotPassword(email);
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/login" />
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<ForgotPasswordPageDiv>
					<h1>Reset Password</h1>
					<div className="main-padding">
                        <div className="main">
							<p>
								Enter the email address you used to register and we'll send you the
								instructions for resetting your password.
							</p>
							<IonInput
							class="input email"
							placeholder="Email"
							type="email"
							inputmode="email"
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

export default ForgotPasswordPage;
