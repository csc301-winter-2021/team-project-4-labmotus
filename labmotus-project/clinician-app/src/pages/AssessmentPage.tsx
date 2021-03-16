import React, {FunctionComponent, useContext, useState} from "react";
import {IonContent, IonPage, IonModal, IonSelect, IonSelectOption, IonAlert} from "@ionic/react";
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
    const [iserror, openAlert] = useState<boolean>(false);

    function createAssessment(assessmentType: string){
        if (!assessmentType){
            openAlert(true);
        }
        else {
            props.createAssessment(assessmentType);
        }
    }

    return (
        <IonPage>                    
            <BaseAssessmentPage getAssessments={props.getAssessments} />
            <AssessmentPageDiv theme={theme}>
                <div className="main-padding">
                    <button onClick={() => setShowCreateAssessment(true)} className="add-button">Add assessment</button>
                    <IonModal isOpen={showCreateAssessment} onDidDismiss={() => setShowCreateAssessment(false)}>
                        <IonSelect value={assessmentType} placeholder={"Select exercise"} onIonChange={e => setAssessmentType(e.detail.value)}>
                            <IonSelectOption value="Squats">Squats</IonSelectOption>
                            <IonSelectOption value="Single Leg Squats">Single Leg Squats</IonSelectOption>
                        </IonSelect>
                        <button onClick={() => createAssessment(assessmentType)} className="add-button">
                            Add Assessment
                        </button>
                        <button onClick={() => setShowCreateAssessment(false)} className="add-button">
                            Cancel
                        </button>
                        <IonAlert
                            isOpen={iserror}
                            onDidDismiss={() => openAlert(false)}
                            header={'No assessment type selected!'}
                            message={'Use the drop down menu to select an exercise'}
                            buttons={["OK"]}
                        />
                    </IonModal>
                </div>
            </AssessmentPageDiv>
        </IonPage>
    );
}


const AssessmentPageDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;
    font-size: 1em;
    outline: none;
  }
  
  .add-button {
    width: 100%;
    font-size: 1em;
    padding: 14px;
    outline: none;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }

  .footer {
    margin-top: 65vh;
  }

`;

export default AssessmentPage;