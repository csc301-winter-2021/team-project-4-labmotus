import {IonContent, IonPage, IonModal} from "@ionic/react";
import {FunctionComponent, useContext, useEffect, useState} from "react";
//@ts-ignore
import styled from "styled-components";

import {ProfilePictureComponent} from "../../../common/ui/components/ProfilePictureComponent";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import API, {getAPIContext} from "../api/API";
import {useParams} from "react-router";
import {Moment} from "moment/moment";
import {Assessment, Patient} from "../../../common/types";
import SymptomLogPage from "../../../common/ui/pages/SymptomLogPage";

export interface PatientProfilePageProps {
}

const PatientProfilePage: FunctionComponent<PatientProfilePageProps> = () => {
    const theme: Theme = useContext(getThemeContext());

    const [showModal, setShowModal] = useState(false);
    const UseAPI: API = useContext(getAPIContext());
    const params: { patientId: string } = useParams();

    const [patientName, setPatientName] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [patientBirthday, setPatientBirthday] = useState("");

    function getAssessments(week: Moment): Promise<Assessment[]> {
        let data = UseAPI.getAssessments(params.patientId, week);
        console.log(data);
        return data;
    }

    useEffect(() => {
        UseAPI.getPatient(params.patientId).then((retPatient: Patient) => {
            setPatientName(retPatient.user.name);
            setPatientEmail(retPatient.user.email);
            setPatientPhone(retPatient.phone);
            setPatientBirthday(retPatient.birthday.format(theme.birthdayFormat));
        });
    }, [patientName]);

    return (
        <IonPage>
            <IonContent fullscreen>
                <PatientProfilePageDiv theme={theme}>
                    <div className="profile-header">
                        <div className="profile-picture">
                            <ProfilePictureComponent
                                imageLink="https://research.cbc.osu.edu/sokolov.8/wp-content/uploads/2017/12/profile-icon-png-898.png"/>
                        </div>
                        <div className="profile-text">
                            <div className="profile-name">
                                <h1>{patientName}</h1>
                            </div>
                            <div className="profile-info">
                                <p>
                                    Phone: <span>{patientPhone}</span>
                                </p>
                                <p>
                                    Email: <span>{patientEmail}</span>
                                </p>
                                <p>
                                    DOB: <span>{patientBirthday}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)}>Edit Profile</button>
                    <IonModal isOpen={showModal} cssClass="edit-patient" onDidDismiss={() => setShowModal(false)}>
                        <h1>Edit Patient Profile</h1>
                    </IonModal>
                </PatientProfilePageDiv>
                <SymptomLogPage baseUrl={"/patients/" + params.patientId} getAssessments={getAssessments}/>
            </IonContent>
        </IonPage>
    );
};

const PatientProfilePageDiv = styled.div`
  //overflow: hidden;
  max-width: 80vw;
  margin: 0 auto;

  .profile-header {
    display: flex;
    align-items: center;

    .profile-text {
      margin-left: 30px;

      .profile-name {
        h1 {
          font-size: 2em;
          font-weight: 700;
        }
      }

      .profile-info {
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        p {
          margin-right: 75px;
          font-size: 1.3em;
        }

        span {
          color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
        }
      }
    }
  }

  button {
    float: right;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
    width: 100%;
    border-radius: 25px;
    max-width: 150px;
    font-size: 1em;
    padding: 10px;
    font-weight: 500;
    outline: none;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  .edit-patient {
  }
`;

export default PatientProfilePage;
