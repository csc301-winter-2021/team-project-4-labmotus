import React, {useContext} from "react";
import {Patient} from "../../../common/types/types"
import {IonIcon, IonItem, IonLabel} from "@ionic/react"
import {ProfilePictureComponent} from "../../../common/ui/components/ProfilePictureComponent";
import {useHistory} from "react-router-dom";
import {chevronForward} from 'ionicons/icons';
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";

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

    const theme = useContext(getThemeContext());
    const history = useHistory();

    return (
        <PatientListingDiv theme={theme} onClick={() => history.push(`/patients/${patient.user.id}`)}>
            <IonItem>
                <ProfilePictureComponent
                    imageLink="https://research.cbc.osu.edu/sokolov.8/wp-content/uploads/2017/12/profile-icon-png-898.png"/>
                <IonLabel className="patient-label">
                    <p className="patient-name">{patient.user.name}</p>
                    <p className="patient-phone">{patient.phone}</p>
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

  .patient-label {
      margin: 10px;
  }

  .patient-name {
      font-weight: bold;
      font-size: 2em;
      line-height: 2em;
      color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
  }

  .patient-phone {
      font-size: 1.2em;
      color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
  }
`;