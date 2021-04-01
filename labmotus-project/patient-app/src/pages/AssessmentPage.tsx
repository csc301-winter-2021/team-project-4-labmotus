import React, {FunctionComponent, useContext, useEffect, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {IonCard, IonIcon, IonPopover, IonSpinner} from "@ionic/react";
import {useHistory, useParams} from "react-router";
import moment from "moment";
import {Assessment} from "../../../common/types/types";
import API from "../api/API";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Scrollbar from "react-scrollbars-custom";
import ReactPlayer from "react-player";
import {Moment} from "moment/moment";

import AssessmentComponent from "../../../common/ui/components/Assessment"
import { chevronBack } from "ionicons/icons";

export interface AssessmentPageProps {
}

const AssessmentPage: FunctionComponent<AssessmentPageProps> = (props: AssessmentPageProps) => {
    const theme: Theme = useContext(getThemeContext());
    const history = useHistory();

    const UseAPI: API = useContext(getAPIContext());
    const params: { patientId: string, date?: string} = useParams();
    const [video, setVideo] = useState<string>(null);
    const [assessments, setAssessments] = useState<Assessment[]>(null);
    const {date}: { date: string } = useParams();
    const day = date ? moment(date, 'YYYY-MM-DD') : moment();

    useEffect(() => {
        setAssessments(null);
        getAssessments(day).then(value => {
            const tAssessments = value.filter(ass => ass.date.format('YYYY-MM-DD') === day.format('YYYY-MM-DD'));
            setAssessments(tAssessments);
        }).catch(reason => {
            console.error(reason);
            setAssessments([]);
        });
    }, [date]);

    function getAssessments(week: Moment): Promise<Assessment[]> {
      return UseAPI.getAssessments(params.patientId, week);
    }
    
    function back() {
        history.goBack()
    }

    function generateBody(){
        if (assessments === null) {
            return <IonSpinner/>
        } else if (assessments.length === 0) {
            return <NoneDiv theme={theme}>No Assessments Today</NoneDiv>
        } else {
            return (
                <Scrollbar>
                    {assessments.map((value) => {
                        return (
                            <IonCard>
                                <AssessmentComponent value={value} day={day} setVideo={setVideo}> </AssessmentComponent>
                                Clinician Notes: {value.notes}
                            </IonCard>
                        )
                    })}
                </Scrollbar>
            )
        }
    }

    return (
        <AssessmentPageDiv>   
            <HeaderDiv>
                <BackButton theme={theme} onClick={back}>
                    <IonIcon icon={chevronBack}/>
                    <HeaderText theme={theme}>
                        Assessment: {day.format(theme.dateFormat)}
                    </HeaderText>
                </BackButton>
            </HeaderDiv> 
            <BodyDiv theme={theme}>
                {generateBody()}   
            </BodyDiv>
              
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
}

const AssessmentPageDiv = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 3%;
    display: flex;
    flex-direction: column;
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

const VideoDiv = styled.div`
    width: 90vw;
    height: 90vh;
`;

export default AssessmentPage;