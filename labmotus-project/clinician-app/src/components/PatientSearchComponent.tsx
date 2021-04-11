import {FunctionComponent, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {IonSearchbar} from "@ionic/react";
import {Patient} from "../../../common/types";

export interface PatientSearchProps {
    allPatients: Patient[];
    setPatientsToShow: (listOfPatients: Patient[]) => void;
}

export const PatientSearchComponent: FunctionComponent<PatientSearchProps> = (props) => {
    const [searchText, setSearchText] = useState("");

    function onSearch(searchText: string) {
        setSearchText(searchText);

        let patientsToShow = [];
        for (const patient of props.allPatients) {
            if (patient.user.name.toLowerCase().includes(searchText.toLowerCase())) {
                patientsToShow.push(patient);
            }
        }
        props.setPatientsToShow(patientsToShow);
    }

    return (
        <Searchbar>
            <IonSearchbar
                value={searchText}
                onIonChange={(e) => onSearch(e.detail.value!)}
                showCancelButton="focus"
                animated
            />
        </Searchbar>
    );
};

const Searchbar = styled.div`
  text-align: left;
`;