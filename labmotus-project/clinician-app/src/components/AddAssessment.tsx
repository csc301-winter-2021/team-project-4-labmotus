import {FunctionComponent, useContext, useState} from "react";
import {IonSelect, IonSelectOption, IonModal, IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";

export interface AddAssessmentProps {
    assessmentType: string;
    setAssessmentType: any;
    addAssessment: any;
    setShowAddAssessment: any;
}

export const AddAssessment: FunctionComponent<AddAssessmentProps> = (props: AddAssessmentProps) => {
    const theme = useContext(getThemeContext());
    const allJoints = ["knee valgus", "knee varus"];
    const [assessmentType, setAssessmentType] = useState<string>(props.assessmentType);
    const [assessmentJoints, setAssessmentJoints] = useState<string[]>([]);
    return (
        <AddAssessmentDiv theme={theme}>
            <h1>Add New Assessment</h1>
            <div className="main-padding">
                <IonSelect
                    value={assessmentType}
                    placeholder={"Select Exercise"}
                    onIonChange={(e) => setAssessmentType(e.detail.value)}
                >
                    <IonSelectOption value="Squats">Squats</IonSelectOption>
                    <IonSelectOption value="Single Leg Squats">Single Leg Squats</IonSelectOption>
                    <IonSelectOption value="Create Own Exercise">Create Own Exercise...</IonSelectOption>
                </IonSelect>
                {/* "assessmentType != 'Create Own Exercise'" */}
                <IonInput  
                    placeholder="Enter Exercise Name"
                    onIonChange = {e => setAssessmentType(e.detail.value)}
                ></IonInput>
                Joints
                <IonSelect 
                    placeholder={"Select Joints"}
                    onIonChange={(e) => setAssessmentJoints(e.detail.value)}
                    multiple={true}
                >
                        {allJoints.map((joint) => {
                            console.log(joint);
                            return (<IonSelectOption value={joint}>{joint}</IonSelectOption>)
                        })}
                </IonSelect>
                {/* todo: at least 1 join. hide select joints option if not custom. patient assessments. */}
                {/* figure out styled error popover. */}
                <button onClick={() => props.addAssessment(assessmentType, assessmentJoints)} className="assessment button">
                    Add Assessment
                </button>
                <button onClick={() => props.setShowAddAssessment(false)} className="cancel button">
                    Cancel
                </button>
            </div>
        </AddAssessmentDiv>
    );
};

const AddAssessmentDiv = styled.div`
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
  }

  ion-select {
    text-align: center;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  .button {
    margin-bottom: 10px;
    width: 100%;
    font-size: 1em;
    padding: 14px;
    outline: none;
  }

  .assessment {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }
`;

export default AddAssessment;
