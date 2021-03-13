import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonContent, IonPage, IonSearchbar} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import {PatientListComponent} from "../components/PatientsListComponent";
import {Patient} from "../../../common/types";
import API, {getAPIContext} from "../api/API";

export interface AllPatientsPageProps {
}

export interface PatientSearchProps {
    allPatients: Patient[]
    setPatientsToShow: (listOfPatients: Patient[]) => void
}

const PatientSearchComponent: FunctionComponent<PatientSearchProps> = (props) => {

    const [searchText, setSearchText] = useState("")

    function onSearch(searchText: string) {
        setSearchText(searchText)

        let patientsToShow = []
        for (const patient of props.allPatients) {
            if (patient.user.name.toLowerCase().includes(searchText.toLowerCase())) {
                patientsToShow.push(patient)
            }
        }

        props.setPatientsToShow(patientsToShow)
    }

    return (
        <IonSearchbar value={searchText} onIonChange={e => onSearch(e.detail.value!)} showCancelButton="focus"
                      animated/>
    )
}

const AllPatientsPage: FunctionComponent<AllPatientsPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = useContext(getThemeContext());

    const emptyPatientsList: Patient[] = []
    const [allPatients, setAllPatients] = useState(emptyPatientsList)
    const [patientsToShow, setPatientsToShow] = useState(allPatients)

    // const history = useHistory();

    function getAllPatients(): void {
        UseAPI.getAllPatients().then(
            (patients: Patient[]) => {
                setAllPatients(patients)
                setPatientsToShow(patients)
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
                    <PatientSearchComponent allPatients={allPatients} setPatientsToShow={setPatientsToShow}/>
                    <PatientListComponent patientList={patientsToShow}/>
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
