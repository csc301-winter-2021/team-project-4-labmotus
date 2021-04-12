import {FunctionComponent, useContext} from "react";
import {IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../theme/Theme";
import Header from "../components/Header";

export interface TermsOfServicePageProps {
    getTermsOfService: () => JSX.Element
}

const TermsOfServicePage: FunctionComponent<TermsOfServicePageProps> = (props: TermsOfServicePageProps) => {
    const theme = useContext(getThemeContext());

    return (
        <TermsOfServicePageDiv theme={theme}>
            <IonPage>
                <Header onBackClick title="Terms of Service"/>
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
