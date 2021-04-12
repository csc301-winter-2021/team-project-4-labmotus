import {FunctionComponent} from "react";
import {IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import Button from "../../../common/ui/components/Button";
import {useHistory} from "react-router";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface LandingPageProps {
}

const LandingPage: FunctionComponent<LandingPageProps> = () => {
    const history = useHistory();

    function downloadAPK() {
        window.open("https://labmotus-misc.s3.amazonaws.com/patient-app-dev.apk");
    }

    function clinicianPortal() {
        history.push("/login");
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <LandingPageDiv>
                    <h1>LabMotus</h1>
                    <CenterWrapper>
                        <div className="main">
                            <Button label="Download Patient App" onClick={downloadAPK} type="primary round"/>
                            <br/>
                            <br/>
                            <Button label="See Clinician Portal" onClick={clinicianPortal} type="primary round"/>
                        </div>
                    </CenterWrapper>
                </LandingPageDiv>
            </IonContent>
        </IonPage>
    );
}

const LandingPageDiv = styled.div`
  overflow: hidden;
  text-align: center;

  @media only screen and (min-width: 768px) {
    form {
      margin: 0 auto;
      max-width: 60vw;
    }
  }
  @media only screen and (min-width: 1024px) {
    form {
      max-width: 40vw;
    }
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
`;

export default LandingPage;
