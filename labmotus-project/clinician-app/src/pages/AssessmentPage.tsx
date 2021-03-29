import {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonModal, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import BaseAssessmentPage from "../../../common/ui/pages/AssessmentPage";
import moment, {Moment} from "moment";
import API, {getAPIContext} from "../api/API";
import {Assessment, AssessmentState} from "../../../common/types/types";
import {useParams} from "react-router";
import AddAssessment from "../components/AddAssessment";

export interface AssessmentPageProps {
}

const AssessmentPage: FunctionComponent<AssessmentPageProps> = (props: AssessmentPageProps) => {
    const theme: Theme = useContext(getThemeContext());

    const [showCreateAssessment, setShowCreateAssessment] = useState(false);
    const [assessmentType, setAssessmentType] = useState("");
    const UseAPI: API = useContext(getAPIContext());
    const params: { patientId: string; date?: string } = useParams();
    const [isalert, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    function getAssessments(week: Moment): Promise<Assessment[]> {
        return UseAPI.getAssessments(params.patientId, week);
    }

    function createAssessment(assessmentType: string) {
        if (!assessmentType) {
            setHeader("No Assessment Type Selected");
            setMessage("Please use the drop down menu to select an exercise.");
            openAlert(true);
        } else {
            const assessment: Assessment = {
                id: Math.floor(Math.random() * 1000000).toString(),
                patientId: params.patientId,
                name: assessmentType,
                date: params.date ? moment(params.date, "YYYY-MM-DD") : moment(),
                state: AssessmentState.MISSING,
                joints: [],
            };
            UseAPI.createAssessment(assessment);
            setShowCreateAssessment(false);
            setHeader("Assessment Added!");
            setMessage("");
            openAlert(true);
        }
    }

    return (
        <IonPage>
            <BaseAssessmentPage getAssessments={getAssessments}/>
            <AssessmentPageDiv theme={theme}>
                <div className="main-padding">
                    <button onClick={() => setShowCreateAssessment(true)} className="add-button">
                        Add Assessment
                    </button>
                    <IonModal isOpen={showCreateAssessment} onDidDismiss={() => setShowCreateAssessment(false)}>
                        <AddAssessment
                            assessmentType={assessmentType}
                            setAssessmentType={setAssessmentType}
                            createAssessment={createAssessment}
                            setShowCreateAssessment={setShowCreateAssessment}
                        />
                        <IonAlert
                            isOpen={isalert}
                            onDidDismiss={() => openAlert(false)}
                            header={header}
                            message={message}
                            buttons={["OK"]}
                        />
                    </IonModal>
                </div>
            </AssessmentPageDiv>
        </IonPage>
    );
};

const AssessmentPageDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;
    font-size: 1em;
    outline: none;
  }

  .add-button {
    width: 100%;
    font-size: 1em;
    padding: 14px;
    outline: none;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }

  .footer {
    margin-top: 65vh;
  }
`;

export default AssessmentPage;
