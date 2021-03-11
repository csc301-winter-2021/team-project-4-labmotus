import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import API, { getAPIContext } from "../../../patient-app/src/api/API";
import {useHistory} from "react-router";
import {PatientListComponent} from "../components/PatientsListComponent";

export interface AllPatientsPageProps {
}

const AllPatientsPage: FunctionComponent<AllPatientsPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const history = useHistory();


    return (
        <IonPage>
            <IonContent fullscreen>
                <AllPatientsPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <PatientListComponent patientList={} />
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
        margin-top: 15vh;
    }
    .footer {
        margin-top: 65vh;
    }
    span {
        cursor: pointer;
        color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    }
`;

export default AllPatientsPage;
