import {FunctionComponent, useContext, useEffect, useState} from "react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {IonAlert, IonCard, IonIcon, IonModal, IonPopover, IonSpinner, IonTextarea} from "@ionic/react";
import {useHistory, useParams} from "react-router";
import moment from "moment";
import {Assessment, AssessmentState, Joints} from "../../../common/types/types";
import API from "../api/API";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Scrollbar from "react-scrollbars-custom";
import ReactPlayer from "react-player";
import {Moment} from "moment/moment";

import AddAssessment from "../components/AddAssessment";
import AssessmentComponent from "../../../common/ui/components/Assessment";
import Button from "../../../common/ui/components/Button";
import {chevronBack} from "ionicons/icons";

export interface AssessmentPageProps {
}

const AssessmentPage: FunctionComponent<AssessmentPageProps> = (props: AssessmentPageProps) => {
    const theme: Theme = useContext(getThemeContext());
    const history = useHistory();

    const [showAddAssessment, setShowAddAssessment] = useState(false);
    const UseAPI: API = useContext(getAPIContext());
    const params: { patientId: string; date?: string } = useParams();
    const [isalert, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>(null);
    const [message, setMessage] = useState<string>(null);
    const [video, setVideo] = useState<string>(null);
    const [assessments, setAssessments] = useState<Assessment[]>(null);
    const {date}: { date: string } = useParams();
    const day = date ? moment(date, "YYYY-MM-DD") : moment();

    useEffect(() => {
        setAssessments(null);
        getAssessments(day)
            .then((value) => {
                const tAssessments = value.filter((ass) => ass.date.format("YYYY-MM-DD") === day.format("YYYY-MM-DD"));
                setAssessments(tAssessments);
            })
            .catch((reason) => {
                console.error(reason);
                setAssessments([]);
            });
    }, [date]);

    function getAssessments(week: Moment): Promise<Assessment[]> {
        return UseAPI.getAssessments(params.patientId, week);
    }

    function back() {
        history.goBack();
    }

    async function getVideo(videoURL: string) {
        UseAPI.getVideo(videoURL).then((data) => setVideo(data));
    }

    function createAssessment(assessmentType: string, joints: Joints[]) {
        if (!assessmentType) {
            setHeader("Invalid Assessment Type");
            setMessage("Please fill out all the fields!")
            openAlert(true);
            return;
        }
        // TODO: have assessments stored somewhere else?
        else if (assessmentType === "Squats") {
            const assessment: Assessment = {
                id: "",
                patientId: params.patientId,
                name: assessmentType,
                date: params.date ? moment(params.date, "YYYY-MM-DD") : moment(),
                state: AssessmentState.MISSING,
                joints: [
                    Joints.Hip_TrunkL,
                    Joints.Hip_TrunkR,
                    Joints.KneeL_Flexion,
                    Joints.KneeR_Flexion,
                    Joints.KneeL_ValgusVarus,
                    Joints.KneeR_ValgusVarus,
                    Joints.AnkleL_Dorsiflexion,
                    Joints.AnkleL_Plantarflexion,
                    Joints.AnkleL_Dorsiflexion,
                    Joints.AnkleL_Plantarflexion,
                ],
                notes: "",
            };
            UseAPI.createAssessment(assessment);
        } else if (assessmentType === "Single Leg Squats") {
            const assessment: Assessment = {
                id: "",
                patientId: params.patientId,
                name: assessmentType,
                date: params.date ? moment(params.date, "YYYY-MM-DD") : moment(),
                state: AssessmentState.MISSING,
                joints: [
                    Joints.Hip_TrunkL,
                    Joints.Hip_TrunkR,
                    Joints.KneeL_Flexion,
                    Joints.KneeR_Flexion,
                    Joints.KneeL_ValgusVarus,
                    Joints.KneeR_ValgusVarus,
                    Joints.AnkleL_Dorsiflexion,
                    Joints.AnkleL_Plantarflexion,
                    Joints.AnkleL_Dorsiflexion,
                    Joints.AnkleL_Plantarflexion,
                ],
                notes: "",
            };
            UseAPI.createAssessment(assessment);
        } else if (assessmentType === "Gait Analysis") {
            const assessment: Assessment = {
                id: "",
                patientId: params.patientId,
                name: assessmentType,
                date: params.date ? moment(params.date, "YYYY-MM-DD") : moment(),
                state: AssessmentState.MISSING,
                joints: [
                    Joints.Hip_TrunkL,
                    Joints.Hip_TrunkR,
                    Joints.KneeL_Flexion,
                    Joints.KneeR_Flexion,
                    Joints.KneeL_ValgusVarus,
                    Joints.KneeR_ValgusVarus,
                    Joints.AnkleL_Dorsiflexion,
                    Joints.AnkleL_Plantarflexion,
                    Joints.AnkleL_Dorsiflexion,
                    Joints.AnkleL_Plantarflexion,
                ],
                notes: "",
            };
            UseAPI.createAssessment(assessment);
        } else {
            const assessment: Assessment = {
                id: "",
                patientId: params.patientId,
                name: assessmentType,
                date: params.date ? moment(params.date, "YYYY-MM-DD") : moment(),
                state: AssessmentState.MISSING,
                joints: joints,
                notes: "",
            };
            UseAPI.createAssessment(assessment);
        }
        setShowAddAssessment(false);
        setHeader("Assessment Added!");
        openAlert(true);
    }

    function generateBody() {
        if (assessments === null) {
            return <IonSpinner/>;
        } else if (assessments.length === 0) {
            return <NoneDiv theme={theme}>No Assessments Today</NoneDiv>;
        } else {
            return (
                <Scrollbar>
                    {assessments.map((value) => {
                        return (
                            <Card theme={theme}>
                                <AssessmentComponent value={value} day={day} setVideo={getVideo}> </AssessmentComponent>
                                <ClinicianNotes>
                                    <Textarea
                                        value={value.notes}
                                        placeholder="Clinician Notes:"
                                        // onIonChange={e => console.log(e.detail.value)}
                                        theme={theme}
                                    >
                                    </Textarea> 
                                    <Button label="Save" type="round primary"/>
                                </ClinicianNotes>
                            </Card>
                        )
                    })}
                </Scrollbar>
            );
        }
    }

    return (
        <AssessmentPageDiv>
            <HeaderDiv>
                <BackButton theme={theme} onClick={back}>
                    <IonIcon icon={chevronBack}/>
                    <HeaderText theme={theme}>Assessment: {day.format(theme.dateFormat)}</HeaderText>
                </BackButton>
            </HeaderDiv>
            <BodyDiv theme={theme}>{generateBody()}</BodyDiv>
            <div className="main-padding">
                <Button label="Add Assessment" onClick={() => setShowAddAssessment(true)} type="primary"/>
                <IonModal isOpen={showAddAssessment} onDidDismiss={() => setShowAddAssessment(false)}>
                    <AddAssessment addAssessment={createAssessment} setShowAddAssessment={setShowAddAssessment}/>
                    <IonAlert
                        isOpen={isalert}
                        onDidDismiss={() => openAlert(false)}
                        header={header}
                        message={message}
                        buttons={["OK"]}
                    />
                </IonModal>
            </div>

            <PopOver
                // cssClass={PopOver.styledComponentId}
                isOpen={video !== null}
                onDidDismiss={() => setVideo(null)}
            >
                <VideoDiv>
                    <ReactPlayer width="100%" height="100%" url={video} playing/>
                </VideoDiv>
            </PopOver>
        </AssessmentPageDiv>
    );
};

const AssessmentPageDiv = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 3%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  ion-content {
    flex: 1;
  }
`;

const PopOver = styled(IonPopover)`
  .popover-content {
    width: fit-content !important;
    height: fit-content !important;
  }
`;

const ClinicianNotes = styled.div`
  align: right;
  margin: 10px;
  Button {
    width:70px;
    padding:10px;
    margin-top: 5px;
    margin-bottom: 10px;
    float: right;
  }
`;

const Textarea = styled(IonTextarea)`
  height: 100px;
  background: ${({theme}: { theme: Theme }) => theme.colors.light};
`;

const BackButton = styled.div`
  ion-icon {
    height: 25px;
    width: 25px;
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
  }

  cursor: pointer;
  display: flex;
  flex-direction: row;
`;

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled.div`
  flex: 1;
  font-size: ${({theme}: { theme: Theme }) => theme.headerFontSize};
  font-family: ${({theme}: { theme: Theme }) => theme.headerFontFamily};
  color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
`;

const NoneDiv = styled.div`
  font-size: ${({theme}: { theme: Theme }) => theme.headerFontSize};
  font-family: ${({theme}: { theme: Theme }) => theme.headerFontFamily};
  color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
`;

const BodyDiv = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1%;

  .ScrollbarsCustom-Track {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.shade} !important;
  }

  .ScrollbarsCustom-Thumb {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary} !important;
  }
`;

const Card = styled(IonCard)`
    box-shadow: none;
    border-radius: 0px;    
    border: 1px solid ${({theme}: { theme: Theme }) => theme.colors.shade};
`;

const VideoDiv = styled.div`
  width: 90vw;
  height: 90vh;
`;

export default AssessmentPage;
