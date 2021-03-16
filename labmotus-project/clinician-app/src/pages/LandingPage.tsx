import {FunctionComponent, useContext} from "react";
import {IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {useHistory} from "react-router";

export interface LandingPageProps {
}

const LandingPage: FunctionComponent<LandingPageProps> = () => {
    const theme = useContext(getThemeContext());
    const history = useHistory();

    function downloadAPK() {
		window.open("https://labmotus-misc.s3.amazonaws.com/patient-app.apk");
    }

    function clinicianPortal() {
        console.log("redirect");
        history.push("/login");
    }
    
    return (
        <IonPage>
            <IonContent fullscreen>
                <LandingPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <div className="main-padding">
                        <div className="main">
                            <button className="landing-button" onClick={downloadAPK}>
                                Download patient app
                            </button>
                            <p></p>
                            <button className="landing-button" onClick={clinicianPortal}>
                                See clinician portal
                            </button>
                        </div>
                    </div>
                </LandingPageDiv>
            </IonContent>
        </IonPage>
    );
}

const LandingPageDiv = styled.div`
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

    @media only screen and (min-width: 768px) {
      form {
        margin: 0 auto;
        max-width: 60vw;
      }

      .landing-button {
        font-size: 1.1em;
      }
    }
    @media only screen and (min-width: 1024px) {
      form {
        max-width: 40vw;
      }
    }

    .landing-button {
        width: 100%;
        border-radius: 25px;
        max-width: 490px;
        font-size: 0.8em;
        padding: 14px;
        font-weight: 500;
        outline: none;
        box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
        background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
        color: white;
    }
    pointer-events: none;
  }

  .main {
    height: 100%;
    width: 100%;
    pointer-events: auto;
  }

  h1 {
    font-weight: bold;
    margin-top: 15vh;
  }

  .footer {
    margin-top: 65vh;
  }

`;

export default LandingPage;