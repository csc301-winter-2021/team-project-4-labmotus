import React, {FunctionComponent} from "react";
import {IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import {PatientListComponent} from "../components/PatientsListComponent";
import {Patient} from "../../../common/types";
import moment from "moment";

export interface AllPatientsPageProps {
}

let patientList: Array<Patient> = [{
    user: {
        id: "sayanfaraz",
        firebaseId: "lolid",
        name: "Sayan Faraz",
        email: "sayan96@hotmail.com"
    },
    phone: "6474718287",
    birthday: moment().set({'year': 1996, 'month': 6, 'day': 30}),
    clinicianID: "adsfaf"
}]

const AllPatientsPage: FunctionComponent<AllPatientsPageProps> = () => {
    // const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    // const history = useHistory();


    return (
        <IonPage>
            <IonContent fullscreen>
                <AllPatientsPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <PatientListComponent patientList={patientList}/>
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
