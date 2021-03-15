import React, {FunctionComponent, useContext, useState} from "react";
import {IonContent, IonPage, IonModal, IonInput, IonSelect, IonSelectOption} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import BaseAssessmentPage from "../../../common/ui/pages/AssessmentPage";
import {Assessment} from "../../../common/types";
import { Moment } from "moment";

export interface AssessmentPageProps {
    createAssessment: (type: string) => void;
    getAssessments: (newWeek: Moment) => Promise<Assessment[]>;
}

const AssessmentPage: FunctionComponent<AssessmentPageProps> = (props: AssessmentPageProps) => {
    const theme: Theme = useContext(getThemeContext());

    const [showCreateAssessment, setShowCreateAssessment] = useState(false);
    const [assessmentType, setAssessmentType] = useState("");

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="main-padding">                
                    <AssessmentPageDiv theme={theme}>
                        <button onClick={() => setShowCreateAssessment(true)} className="add-button">Add assessment</button>

                        <BaseAssessmentPage getAssessments={props.getAssessments} />
                        <IonModal isOpen={showCreateAssessment} onDidDismiss={() => setShowCreateAssessment(false)}>
                            <IonSelect value={assessmentType} placeholder={"Select Type"} onIonChange={e => setAssessmentType(e.detail.value)}>
                                <IonSelectOption value="Squats">Squats</IonSelectOption>
                                <IonSelectOption value="Single Leg Squats">Single Leg Squats</IonSelectOption>
                            </IonSelect>
                            <button onClick={() => props.createAssessment(assessmentType)} className="add-button">
                                Add Assessment
                            </button>
                        </IonModal>
                    </AssessmentPageDiv>
                </div>
            </IonContent>
        </IonPage>
    );
}


const AssessmentPageDiv = styled.div`
  overflow: hidden;
  text-align: center;
  height: 100%;
  width: 100%;
  padding: 5%;

  .add-button {
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

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;
  }

  .IonModal {
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  .footer {
    margin-top: 65vh;
  }

`;

export default AssessmentPage;