import {IonContent, IonPage} from "@ionic/react";
import {FunctionComponent, useContext} from "react";
//@ts-ignore
import styled from "styled-components";
import {ProfilePictureComponent} from "../../../common/ui/components/ProfilePictureComponent";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";

export interface PatientProfilePageProps {
}

const PatientProfilePage: FunctionComponent<PatientProfilePageProps> = () => {

    const theme: Theme = useContext(getThemeContext());

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
                                <p>Phone: 123-456-789</p>
                                <p>Email: email@email.com</p>
                                <p>DOB: January 1, 2000</p>
                            </div>
                        </div>
                    </div>
                </PatientProfilePageDiv>
            </IonContent>
        </IonPage>
    );
};

const PatientProfilePageDiv = styled.div`
  overflow: hidden;

  .profile-header {
    max-width: 80vw;
    margin: 0 auto;
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
          color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
        }
      }
    }
  }
`;

export default PatientProfilePage;
