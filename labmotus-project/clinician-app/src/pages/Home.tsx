import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import moment from 'moment';
import React from 'react';
import { Patient } from '../../../common/types/types';
import { PatientListComponent } from '../components/PatientsListComponent';
import './Home.css';

const Home: React.FC = () => {

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

  return (
    <IonPage>
      <IonHeader>
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
      <IonContent fullscreen>
        <PatientListComponent patientList={patientList} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
