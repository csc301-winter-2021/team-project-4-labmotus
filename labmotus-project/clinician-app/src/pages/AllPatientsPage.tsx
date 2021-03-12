import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import {PatientListComponent} from "../components/PatientsListComponent";
import {Patient} from "../../../common/types";
import API, {getAPIContext} from "../api/API";

export interface AllPatientsPageProps {
}

const AllPatientsPage: FunctionComponent<AllPatientsPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = useContext(getThemeContext());

    const emptyPatientsList: Patient[] = []
    const [allPatients, setAllPatients] = useState(emptyPatientsList)

    // const history = useHistory();

    function getAllPatients(): void {
        UseAPI.getAllPatients().then(
            (patients: Patient[]) => {
                setAllPatients(patients)
            },
            () => {
                // pass
            }
        )
    }

    useEffect(() => {
        getAllPatients()
    }, [])

    return (
        <IonPage>
            <IonContent fullscreen>
                <AllPatientsPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <PatientListComponent patientList={allPatients}/>
                </AllPatientsPageDiv>
            </IonContent>
        </IonPage>
    );
};

const AllPatientsPageDiv = styled.div`
  overflow: hidden;
  text-align: center;

  h1 {
    font-weight: bold;
    margin-top: 10vh;
  }

  span {
    cursor: pointer;
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    }
`;

export default AllPatientsPage;
