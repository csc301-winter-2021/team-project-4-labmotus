import {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {PatientListComponent} from "../components/PatientsListComponent";
import {Patient} from "../../../common/types";
import API from "../api/API";
import {useHistory} from "react-router";
import {PatientSearchComponent} from "../components/PatientSearchComponent";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Button from "../../../common/ui/components/Button";

export interface AllPatientsPageProps {
}

const AllPatientsPage: FunctionComponent<AllPatientsPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = useContext(getThemeContext());
    const history = useHistory();

    const emptyPatientsList: Patient[] = [];
    const [allPatients, setAllPatients] = useState(emptyPatientsList);
    const [patientsToShow, setPatientsToShow] = useState(allPatients);

    function getAllPatients(): void {
        UseAPI.getAllPatients().then(
            (patients: Patient[]) => {
                setAllPatients(patients);
                setPatientsToShow(patients)
            },
            () => {
                // pass
            }
        )
    }

    function signupPatient(): void {
        history.push('/sign-up-patient');
    }

    useEffect(() => {
        getAllPatients()
    }, []);

    return (
        <IonPage>
            <IonContent fullscreen>
                <AllPatientsPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <Button label="Add Patient" onClick={signupPatient} type="primary round"/>
                    <PatientsViewDiv>
                        <PatientSearchComponent allPatients={allPatients} setPatientsToShow={setPatientsToShow}/>
                        <PatientListComponent patientList={patientsToShow}/>
                    </PatientsViewDiv>
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

const PatientsViewDiv = styled.div`
  overflow: hidden;
  text-align: center;

  width: 80vw;
  margin-top: 5vh;
  margin-left: 10vw;
`;

export default AllPatientsPage;
