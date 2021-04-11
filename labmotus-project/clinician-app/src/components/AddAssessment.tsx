import {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonSelect, IonSelectOption, IonInput} from "@ionic/react";
import {Joints} from "../../../common/types/types";
import API from "../api/API";
import {getAPIContext} from "../../../common/api/BaseAPI";

// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";

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

    function getAllJoints(): void {
        UseAPI.getAllJoints().then(
            (joints: any[]) => {
                setAllJoints(joints);
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
                    <IonSelect
                        placeholder={"Select Custom Assessment Joints"}
                        onIonChange={(e) => setAssessmentJoints(e.detail.value)}
                        multiple={true}
                    >
                        {allJoints.map((value) => {
                            return <IonSelectOption value={value.joint as Joints}>{value.name}</IonSelectOption>;
                        })}
                    </IonSelect>
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
        <AddAssessmentDiv theme={theme}>
            <h1>Add New Assessment</h1>
            <div className="main-padding">
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
                    <IonSelectOption value="Custom">Create Custom...</IonSelectOption>
                </IonSelect>
                {generateCustomFields()}
                {/* todo: at least 1 joint. hide select joints option if not custom. patient assessments. */}
                {/* figure out styled error popover. delete assessment. save/delete assessment type (impl later?) */}
                {/* clean up id value stuff to be the correct thing */}
                <div className="buttons">
                    <Button
                        label="Add Assessment"
                        onClick={() => {
                            if (customAssessment) {
                                props.addAssessment(customType, assessmentJoints);
                            } else {
                                props.addAssessment(assessmentType, assessmentJoints);
                            }
                        }}
                        type="primary full"
                    />
                    <Button label="Cancel" onClick={() => props.setShowAddAssessment(false)} type="full"/>
                </div>
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

  ion-select, ion-input {
    text-align: center;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  .buttons > * {
    margin-top: 10px;
  }
`;

export default AddAssessment;
