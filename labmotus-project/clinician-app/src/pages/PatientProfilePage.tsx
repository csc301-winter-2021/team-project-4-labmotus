import {IonContent, IonPage, IonModal} from "@ionic/react";
import {FunctionComponent, useContext, useState} from "react";
//@ts-ignore
import styled from "styled-components";

import {ProfilePictureComponent} from "../../../common/ui/components/ProfilePictureComponent";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";

export interface PatientProfilePageProps {
}

const PatientProfilePage: FunctionComponent<PatientProfilePageProps> = () => {
    const theme: Theme = useContext(getThemeContext());

    const [showModal, setShowModal] = useState(false);

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
                                <h1>First Last</h1>
                            </div>
                            <div className="profile-info">
                                <p>
                                    Phone: <span>123-456-789</span>
                                </p>
                                <p>
                                    Email: <span>email@email.com</span>
                                </p>
                                <p>
                                    DOB: <span>January 1, 2000</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)}>Edit Profile</button>
                    <IonModal isOpen={showModal} cssClass="edit-patient" onDidDismiss={() => setShowModal(false)}>
                        <h1>Edit Patient Profile</h1>
                    </IonModal>
                </PatientProfilePageDiv>
            </IonContent>
        </IonPage>
    );
};

const PatientProfilePageDiv = styled.div`
  overflow: hidden;
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
