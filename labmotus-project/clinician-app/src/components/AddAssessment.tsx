import {FunctionComponent, useContext} from "react";
import {IonSelect, IonSelectOption} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";

export interface AddAssessmentProps {
    assessmentType: string;
    setAssessmentType: any;
    createAssessment: any;
    setShowCreateAssessment: any;
}

export const AddAssessment: FunctionComponent<AddAssessmentProps> = (props: AddAssessmentProps) => {
    const theme = useContext(getThemeContext());

    return (
        <AddAssessmentDiv theme={theme}>
            <h1>Add New Assessment</h1>
            <div className="main-padding">
                <IonSelect
                    value={props.assessmentType}
                    placeholder={"Select Exercise"}
                    onIonChange={(e) => props.setAssessmentType(e.detail.value)}
                >
                    <IonSelectOption value="Squats">Squats</IonSelectOption>
                    <IonSelectOption value="Single Leg Squats">Single Leg Squats</IonSelectOption>
                </IonSelect>
                <button onClick={() => props.createAssessment(props.assessmentType)} className="assessment button">
                    Add Assessment
                </button>
                <button onClick={() => props.setShowCreateAssessment(false)} className="cancel button">
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
