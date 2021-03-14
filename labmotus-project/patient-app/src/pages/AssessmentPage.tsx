import React, {FunctionComponent, useEffect, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {IonIcon, IonPopover, IonSpinner} from "@ionic/react";
import {chevronBack, film, videocam} from "ionicons/icons";
import {useHistory, useParams} from "react-router";
import moment from "moment";
import {Assessment, AssessmentState} from "../../../common/types/types";
import API, {getAPIContext} from "../api/API";
import Scrollbar from "react-scrollbars-custom";
import Accordion from "../../../common/ui/components/Accordion";
import ReactPlayer from "react-player";

export interface AssessmentPageProps {
}

const AssessmentPage: FunctionComponent<AssessmentPageProps> = ({}) => {
    const UseAPI: API = React.useContext(getAPIContext());
    const theme: Theme = React.useContext(getThemeContext());
    const {date}: { date: string } = useParams();
    const day = date ? moment(date, 'YYYY-MM-DD') : moment();
    const history = useHistory();
    const [assessments, setAssessments] = useState<Assessment[]>(null);
    const [video, setVideo] = useState<string>(null);
    const [expanded, setExpanded] = useState<boolean[]>([]);

    useEffect(() => {
        setAssessments(null);
        UseAPI.getCurrUsersAssessments(day).then(value => {
            const tAssessments = value.filter(ass => ass.date.format('YYYY-MM-DD') === day.format('YYYY-MM-DD'));
            setAssessments(tAssessments);
            setExpanded(tAssessments.map(ass => ass.state === AssessmentState.COMPLETE))
        }).catch(reason => {
            console.error(reason);
            setAssessments([]);
            setExpanded([]);
        });
    }, [date]);

    function back() {
        history.push(`/home/${day.format('YYYY-MM-DD')}`)
    }

    function onClick(index: number) {
        if (assessments[index].state !== AssessmentState.MISSING) {
            const newExpanded = [...expanded];
            newExpanded[index] = !expanded[index];
            setExpanded(newExpanded);
        }
    }

    function onWatch(index: number) {
        if (assessments[index].videoUrl !== undefined) {
            UseAPI.getVideo(assessments[index].videoUrl).then(videoURL => setVideo(videoURL));
        }
    }

    function record(assessmentID: string) {
        history.push(`/record/${assessmentID}`)
    }

    function generateBody() {
        if (assessments === null) {
            return <IonSpinner/>
        } else if (assessments.length === 0) {
            return <NoneDiv theme={theme}>No Assessments Today</NoneDiv>
        } else {
            return (<Scrollbar>
                {assessments.map((value, index) => {
                    let color = moment().format('YYYY-MM-DD') === day.format('YYYY-MM-DD') ? theme.colors.success : theme.colors.contrast;
                    if (value.state === AssessmentState.PENDING)
                        color = theme.colors.warning;
                    else if (value.state === AssessmentState.MISSING)
                        color = theme.colors.alert;
                    return (<AccordionContainer color={color} key={index}>
                        <Accordion label={value.name} expanded={expanded[index]} onClick={() => onClick(index)}>
                            {value.state !== AssessmentState.MISSING && value.stats ?
                                value.stats.map((stat, i) => (
                                    <StatDiv theme={theme} key={i}>
                                        {`${stat.name}: ${stat.currValue}${stat.unit}\t Goal: ${stat.goalValue}${stat.unit}`}
                                    </StatDiv>
                                )) : null
                            }
                            {
                                value.state === AssessmentState.PENDING ?
                                    <IonSpinner name="dots"/> : null
                            }
                        </Accordion>
                        {value.state === AssessmentState.MISSING ?
                            <RecordButton theme={theme} onClick={() => record(value.id)}>
                                <IonIcon icon={videocam}/>
                                Record
                            </RecordButton> : null
                        }
                        {value.videoUrl !== undefined ?
                            <VideoButton theme={theme} onClick={() => onWatch(index)}>
                                <IonIcon icon={film}/>
                                Watch
                            </VideoButton> : null
                        }
                    </AccordionContainer>)
                })}
            </Scrollbar>)
        }
    }

    return (<AssessmentPageDiv className="assessment-page">
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
            cssClass={PopOver.styledComponentId}
            isOpen={video !== null}
            onDidDismiss={() => setVideo(null)}
        >
            <VideoDiv>
                <ReactPlayer width="100%" height="100%" url={video} playing/>
            </VideoDiv>
        </PopOver>
    </AssessmentPageDiv>)
};

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

const StatDiv = styled.div`
    margin-left: 20px;
    font-size: ${({theme}: { theme: Theme }) => theme.subheaderFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.subheaderFontFamily};
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

const AccordionContainer = styled.div`
    position: relative;
    .accordion {
        .accordion-label {
            color: ${({color}: { color: string }) => color};
        }
    }
`;

const RecordButton = styled.div`
    position: absolute;
    top: 10%;
    right: 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.alert};
    color: ${({theme}: { theme: Theme }) => theme.colors.light};
    padding: 5px;
    box-sizing: border-box;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    ion-icon {
        margin-right: 3px;
    }
    cursor: pointer;
`;

const VideoButton = styled.div`
    position: absolute;
    top: 10%;
    right: 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.success};
    color: ${({theme}: { theme: Theme }) => theme.colors.light};
    padding: 5px;
    box-sizing: border-box;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    ion-icon {
        margin-right: 3px;
    }
    cursor: pointer;
`;

const VideoDiv = styled.div`
    width: 90vw;
    height: 90vh;
`;

export default AssessmentPage;
