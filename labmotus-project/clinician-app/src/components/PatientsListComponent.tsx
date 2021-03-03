import React from "react"
import { Patient } from "../../../common/types/types"
import { IonIcon, IonItem, IonLabel } from "@ionic/react"
import { ProfilePictureComponent } from "../../../common/ui/components/ProfilePictureComponent";
import { useHistory } from "react-router-dom";
import { chevronForward } from 'ionicons/icons';

export interface PatientListProp {
  patientList: Array<Patient>
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

  return(
    <div onClick={() => history.push("/patients/")}>
      <IonItem>
        <ProfilePictureComponent imageLink="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"/>
          <IonLabel>
            <h1>{patient.user.name}</h1>
            <h3>{patient.phone}</h3>
          </IonLabel>
          <IonIcon icon={chevronForward} />
      </IonItem>
    </div>
  )
}