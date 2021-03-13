import React from "react"
import {Patient} from "../../../common/types/types"
import {IonIcon, IonItem, IonLabel} from "@ionic/react"
import {ProfilePictureComponent} from "../../../common/ui/components/ProfilePictureComponent";
import {useHistory} from "react-router-dom";
import {chevronForward} from 'ionicons/icons';
import styled from "styled-components";
// import {Theme} from "../../../common/ui/theme/Theme";

export interface PatientListProp {
    patientList: Patient[]
}

export const PatientListComponent: React.FC<PatientListProp> = (props: PatientListProp) => {

    function generatePatientList(): Array<JSX.Element> {
        let retPatients: Array<JSX.Element> = []

        props.patientList.forEach(patient => {
            retPatients.push(
                <PatientListing {...patient} />
            )
        })
        return retPatients
    }

    return (
        <>{generatePatientList()}</>
    )
}

export const PatientListing: React.FC<Patient> = (patient: Patient) => {

    const history = useHistory()

    return (
        <PatientListingDiv onClick={() => history.push("/patients/")}>
            <IonItem>
                <ProfilePictureComponent
                    imageLink="https://research.cbc.osu.edu/sokolov.8/wp-content/uploads/2017/12/profile-icon-png-898.png"/>
                <IonLabel>
                    <h1>{patient.user.name}</h1>
                    <h3>{patient.phone}</h3>
                </IonLabel>
                <IonIcon icon={chevronForward}/>
            </IonItem>
        </PatientListingDiv>
    )
}

const PatientListingDiv = styled.div`
  overflow: hidden;
  text-align: center;

  width: 80vw;
  margin-left: 10vw;

  h1 {
    font-weight: bold;
    margin-top: 5vh;
  }
`;