import React from "react"
import { Patient } from "../../../common/types/types"
import { IonItem, IonLabel } from "@ionic/react"

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

  return(
    <div>
      <IonItem>
          <IonLabel>
            <h1>{patient.user.name}</h1>
            <h3>{patient.phone}</h3>
            {/* <p>Listen, I've had a pretty messed up day...</p> */}
          </IonLabel>
      </IonItem>
    </div>
  )
}