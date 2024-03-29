import {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonAlert, IonContent, IonModal, IonPage} from "@ionic/react";
//@ts-ignore
import styled from "styled-components";
import moment from "moment";

import {ProfilePictureComponent} from "../../../common/ui/components/ProfilePictureComponent";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API, {getAPIContext} from "../api/API";
import {useParams} from "react-router";
import {Moment} from "moment/moment";
import {Assessment, Patient} from "../../../common/types";
import SymptomLogPage from "../../../common/ui/pages/SymptomLogPage";
import EditPatient from "../components/EditPatient";

export interface PatientProfilePageProps {
}

const PatientProfilePage: FunctionComponent<PatientProfilePageProps> = () => {
    const theme: Theme = useContext(getThemeContext());

    const [showEditPatient, setEditPatient] = useState(false);
    const UseAPI: API = useContext(getAPIContext());
    const params: { patientId: string } = useParams();

    const [patient, setPatient] = useState<Patient>(null);
    const [patientName, setPatientName] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [patientBirthday, setPatientBirthday] = useState<Moment>(moment());
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    function getAssessments(week: Moment): Promise<Assessment[]> {
        return UseAPI.getAssessments(params.patientId, week);
    }

    useEffect(() => {
        UseAPI.getPatient(params.patientId).then((retPatient: Patient) => {
            setPatientName(retPatient.user.name);
            setPatientEmail(retPatient.user.email);
            setPatientPhone(retPatient.phone);
            setPatientBirthday(moment(retPatient.birthday));
            setPatient(patient);
        });
    }, [params.patientId]);

    async function updatePatient() {
        // Check if user has entered a name
        if (!patientName) {
            setHeader("Invalid Name");
            setMessage("Please enter the patient's full name.");
            openAlert(true);
            return;
        }
        // Check if user has entered a valid email
        const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!patientEmail || !validEmail.test(patientEmail.toLowerCase())) {
            setHeader("Invalid Email");
            setMessage("Please enter a valid email address.");
            openAlert(true);
            return;
        }
        // Check if user has entered a valid phone number
        const validNumber = /^\d{10}$/;
        if (!patientPhone || !validNumber.test(patientPhone)) {
            setHeader("Invalid Phone Number");
            setMessage("Please enter a valid phone number. The phone number should be 10 numbers.");
            openAlert(true);
            return;
        }
        try {
            if (patient != null) {
                patient.user.name = patientName;
                patient.user.email = patientEmail;
                patient.phone = patientPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                patient.birthday = moment(patientBirthday);
                UseAPI.updatePatient(patient).then(value => setPatient(value));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setEditPatient(false);
        }
    }

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
                                    DOB: <span>{patientBirthday.format(theme.birthdayFormat)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setEditPatient(true)}>Edit Profile</button>
                    <IonModal isOpen={showEditPatient} onDidDismiss={() => setEditPatient(false)}>
                        <EditPatient
                            name={patientName}
                            setName={setPatientName}
                            email={patientEmail}
                            setEmail={setPatientEmail}
                            phone={patientPhone.split("-").join("")}
                            setPhone={setPatientPhone}
                            birthday={moment(patientBirthday)}
                            setBirthday={setPatientBirthday}
                            save={updatePatient}
                        />
                    </IonModal>
                </PatientProfilePageDiv>
                <SymptomLogPage baseUrl={"/patients/" + params.patientId} getAssessments={getAssessments}/>
            </IonContent>
            <IonAlert
                isOpen={isError}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </IonPage>
    );
};

const PatientProfilePageDiv = styled.div`
  //overflow: hidden;
  max-width: 80vw;
  margin: 5vh auto;

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
`;

export default PatientProfilePage;
