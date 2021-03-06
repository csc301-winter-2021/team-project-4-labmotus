import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
import {IonIcon} from "@ionic/react";
import {funnel} from "ionicons/icons";

export interface AssessmentPageProps {
}

const AssessmentPage: FunctionComponent<AssessmentPageProps> = ({}) => {
    const theme = React.useContext(ThemeContext);

    return (<AssessmentPageDiv className="assessment-page">
        <HeaderDiv theme={theme}>
            <HeaderText theme={theme}>
                Assessments
            </HeaderText>
            <IonIcon icon={funnel}/>
        </HeaderDiv>
    </AssessmentPageDiv>)
};

const AssessmentPageDiv = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 3%;
    display: flex;
    flex-direction: column;
    ion-content {
        flex: 1;
    }
`;

const HeaderDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    ion-icon {
        height: 30px;
        color: ${({theme}: { theme: Theme }) => theme.colors.primary};
        cursor: pointer;
    }
`;

const HeaderText = styled.div`
    flex: 1;
    font-size: ${({theme}: { theme: Theme }) => theme.headerFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.headerFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast}; 
`;

export default AssessmentPage;
