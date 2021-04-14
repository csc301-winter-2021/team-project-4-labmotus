import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonSelect, IonSelectOption, IonInput, IonItem, IonCheckbox} from "@ionic/react";
import {Joints} from "../../../common/types/types";
import API from "../api/API";
import {getAPIContext} from "../../../common/api/BaseAPI";

// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";
import Scrollbar from "react-scrollbars-custom";

export interface AddAssessmentProps {
    addAssessment: any;
    setShowAddAssessment: any;
}

export const AddAssessment: FunctionComponent<AddAssessmentProps> = (props: AddAssessmentProps) => {
    const theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());
    const [assessmentType, setAssessmentType] = useState<string>("");
    const [assessmentJoints, setAssessmentJoints] = useState<Joints[]>([]);
    const [allJoints, setAllJoints] = useState<any[]>([]);
    const [customAssessment, setCustomAssessment] = useState<boolean>(false);
    const [customType, setCustomType] = useState<string>("");
    const [selectedJoints, setSelectedJoints] = useState<boolean[]>([]);

    function getAllJoints(): void {
        UseAPI.getAllJoints().then(
            (joints: any[]) => {
                setAllJoints(joints);
                setSelectedJoints(new Array(allJoints.length).fill(false));
            },
            () => {
                // pass
            }
        );
    }

    function generateCustomFields() {
        if (customAssessment)
            return (

                <div>
                    <IonInput
                        placeholder="Enter Custom Assessment Name"
                        onIonChange={(e) => setCustomType(e.detail.value)}
                    />
                    {/* <IonSelect
                        placeholder={"Select Custom Assessment Joints"}
                        onIonChange={(e) => setAssessmentJoints(e.detail.value)}
                        multiple={true}
                    >
                        {allJoints.map((value) => {
                            return <IonSelectOption value={value.joint as Joints}>{value.name}</IonSelectOption>;
                        })}
                    </IonSelect> */}
                    {allJoints.map((value, i) => (
                        <IonItem key={i}>
                            {value.name}
                            <IonCheckbox 
                                slot="start" 
                                color="secondary"
                                onIonChange={e => selectedJoints[i] = e.detail.checked}
                            />
                        </IonItem>
                    ))}
                </div>
            );
        else {
            return;
        }
    }

    useEffect(() => {
        getAllJoints();
    }, []);

    return (
        <AddAssessmentScrollbar theme={theme}>
            <AddAssessmentDiv theme={theme}>
                <h1>Add New Assessment</h1>
                <IonSelect
                    value={assessmentType}
                    placeholder={"Select Assessment"}
                    onIonChange={(e) => {
                        setAssessmentType(e.detail.value);
                        setCustomAssessment(e.detail.value === "Custom");
                    }}
                >
                    <IonSelectOption value="Squats">Squats</IonSelectOption>
                    <IonSelectOption value="Single Leg Squats">Single Leg Squats</IonSelectOption>
                    <IonSelectOption value="Gait Analysis">Gait Analysis</IonSelectOption>
                    <IonSelectOption value="Custom">Create Custom</IonSelectOption>
                </IonSelect>
                    {generateCustomFields()}
                <div className="buttons">
                    <Button
                        label="Add Assessment"
                        onClick={() => {
                            if (customAssessment) {
                                allJoints.forEach((joint, i)=>{
                                    if (selectedJoints[i]){
                                        assessmentJoints.push(joint as Joints);
                                    } 
                                })
                                props.addAssessment(customType, assessmentJoints);
                            } else {
                                props.addAssessment(assessmentType, assessmentJoints);
                            }
                        }}
                        type="primary full"
                    />
                    <Button label="Cancel" onClick={() => props.setShowAddAssessment(false)} type="full"/>
                </div>
            </AddAssessmentDiv>
        </AddAssessmentScrollbar>

    );
};

const AddAssessmentScrollbar = styled(Scrollbar)`
    .ScrollbarsCustom-Track {
        background-color: ${({theme}: { theme: Theme }) => theme.colors.shade} !important;
      }
    
      .ScrollbarsCustom-Thumb {
        background-color: ${({theme}: { theme: Theme }) => theme.colors.primary} !important;
      }
`;

const AddAssessmentDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;
  text-align: center;

  ion-select, ion-input {
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  .buttons > * {
    margin-top: 10px;
  }
`;

export default AddAssessment;
