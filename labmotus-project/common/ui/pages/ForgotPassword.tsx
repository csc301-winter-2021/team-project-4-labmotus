import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../theme/Theme";
import Button from "../../../common/ui/components/Button";
import CenterWrapper from "../components/CenterWrapper";

export interface ForgotPasswordProps {
    email: string;
    setEmail: any;
    onForgotPassword: any;
}

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
    const theme: Theme = useContext(getThemeContext());

    return (
        <ForgotPasswordDiv theme={theme}>
            <h1>Reset Password</h1>
            <CenterWrapper>
                <div className="form">
                    <p>
                        Enter the email address you used to register and we'll send you the instructions for resetting
                        your password.
                    </p>

                    <IonInput
                        className="input"
                        placeholder="Email"
                        type="email"
                        value={props.email}
                        autofocus={true}
                        onIonChange={(e) => props.setEmail(e.detail.value!)}
                    />
                    <Button label="Submit" onClick={props.onForgotPassword} type="primary round"/>
                </div>
            </CenterWrapper>
        </ForgotPasswordDiv>
    );
};

const ForgotPasswordDiv = styled.div`
  overflow: hidden;
  text-align: center;
  pointer-events: auto;

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

  h1 {
    font-weight: bold;
    margin-top: 10vh;
  }
`;

export default ForgotPassword;
