import React, {useContext} from "react";
import {Patient} from "../../../common/types/types"
import {IonIcon, IonItem, IonLabel} from "@ionic/react"
import {ProfilePictureComponent} from "../../../common/ui/components/ProfilePictureComponent";
import {useHistory} from "react-router-dom";
import {chevronForward} from 'ionicons/icons';
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import moment from "moment";

export interface PatientListProp {
    patientList: Patient[]
}

export const PatientListComponent: React.FC<PatientListProp> = (props: PatientListProp) => {

    function generatePatientList(): Array<JSX.Element> {
        let retPatients: Array<JSX.Element> = [];

        props.patientList.forEach((patient, i) => {
            retPatients.push(
                <PatientListing key={i} {...patient} />
            )
        });
        return retPatients
    }

    return (
        <>{generatePatientList()}</>
    )
};

export const PatientListing: React.FC<Patient> = (patient: Patient) => {

    const theme = useContext(getThemeContext());
    const history = useHistory();
    const day = moment().format('YYYY-MM-DD');

    return (
        <PatientListingDiv theme={theme} onClick={() => history.push(`/patients/${patient.user.id}/${day}`)}
                           data-testid="patient-listing">
            <IonItem>
                <ProfilePictureComponent
                    imageLink="https://research.cbc.osu.edu/sokolov.8/wp-content/uploads/2017/12/profile-icon-png-898.png"/>
                <IonLabel className="patient-label">
                    <p className="patient-name" data-testid="patient-name">{patient.user.name}</p>
                    <p className="patient-phone" data-testid="patient-phone">{patient.phone}</p>
                </IonLabel>
                <IonIcon icon={chevronForward}/>
            </IonItem>
        </PatientListingDiv>
    )
};

const PatientListingDiv = styled.div`
  .patient-label {
    margin: 2vw;
  }

  .patient-name {
    font-size: 1.3em;
    line-height: 1.3em;
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
  }

  .patient-phone {
    font-size: 1em;
    color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
  }
`;
