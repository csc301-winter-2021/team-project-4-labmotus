import { FunctionComponent, useContext } from "react";
import { IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import { Theme, getThemeContext } from "../../../common/ui/theme/Theme";
import { useHistory } from "react-router";
import { chevronBack } from "ionicons/icons";

export interface TermsOfServicePageProps {}

const TermsOfServicePage: FunctionComponent<TermsOfServicePageProps> = () => {
    const theme = useContext(getThemeContext());
    const history = useHistory();

    // When user clicks 'Back'
    function back() {
        history.goBack();
    }

    return (
        <TermsOfServicePageDiv theme={theme}>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={back}>
                            <IonIcon icon={chevronBack} />
                            Back
                        </IonButtons>
                        <IonTitle>Terms of Service</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <div className="main-padding">
                        <h1>Sample Header</h1>
                        <p>Sample test under header. Actual Terms of Service will be written in a future version!</p>
                    </div>
                </IonContent>
            </IonPage>
        </TermsOfServicePageDiv>
    );
};

const TermsOfServicePageDiv = styled.div`
    overflow: hidden;
    width: 100%;
    height: 100%;
    .main-padding {
        padding: 5%;
    }
    ion-buttons {
        color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
        cursor: pointer;
        ion-icon {
            height: 25px;
            width: 25px;
        }
    }
`;

export default TermsOfServicePage;
