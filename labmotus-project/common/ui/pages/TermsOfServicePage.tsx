import { FunctionComponent, useContext } from "react";
import { IonContent, IonPage } from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import { Theme, getThemeContext } from "../theme/Theme";
import { useHistory } from "react-router";
import Header from "../components/Header";

export interface TermsOfServicePageProps {
    getTermsOfService: () => JSX.Element
}

const TermsOfServicePage: FunctionComponent<TermsOfServicePageProps> = (props: TermsOfServicePageProps) => {
    const theme = useContext(getThemeContext());
    const history = useHistory();

    // When user clicks 'Back'
    function back() {
        history.goBack();
    }

    return (
        <TermsOfServicePageDiv theme={theme}>
            <IonPage>
                <Header onBackClick={back} title="Terms of Service"/>
                <IonContent>
                    {props.getTermsOfService()}
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
`;

export default TermsOfServicePage;
