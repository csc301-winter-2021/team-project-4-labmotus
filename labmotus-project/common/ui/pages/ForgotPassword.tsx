import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../theme/Theme";
import Button from "../../../common/ui/components/Button";

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
            <div className="main-padding">
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
                    <Button label="Submit" onClick={props.onForgotPassword} style="round"/>
                </div>
            </div>
        </ForgotPasswordDiv>
    );
};

const ForgotPasswordDiv = styled.div`
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
    pointer-events: auto;
  }

  h1 {
    font-weight: bold;
    margin-top: 15vh;
  }
`;

export default ForgotPassword;
