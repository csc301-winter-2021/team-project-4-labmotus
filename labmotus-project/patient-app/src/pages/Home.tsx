import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { ProfilePictureComponent } from "@labmotus/ui";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hello world</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ProfilePictureComponent imageLink={"https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"} />
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
