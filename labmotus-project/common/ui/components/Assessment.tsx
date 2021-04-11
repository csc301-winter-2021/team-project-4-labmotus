import React, {FunctionComponent, useEffect, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {getThemeContext, Theme} from "../theme/Theme";
import {IonIcon, IonSpinner} from "@ionic/react";
import {film, videocam} from "ionicons/icons";
import {useHistory} from "react-router";
import {Assessment, AssessmentState} from "../../types/types";
import Accordion from "../components/Accordion";
import moment, {Moment} from "moment";

export interface AssessmentComponentProps {
    value: Assessment
    day: Moment
    setVideo: any
}

const AssessmentComponent: FunctionComponent<AssessmentComponentProps> = (props: AssessmentComponentProps) => {
    const theme: Theme = React.useContext(getThemeContext());
    const history = useHistory();
    const [expanded, setExpanded] = useState<boolean>(false);

    function onClick() {
        if (props.value.state !== AssessmentState.MISSING) {
            setExpanded(!expanded);
        }
    }

    function onWatch() {
        if (props.value.videoUrl !== undefined) {
            props.setVideo(props.value.videoUrl);
        }
    }

    function record(assessmentID: string) {
        history.push(`/record/${assessmentID}`)
    }

    useEffect(() => {
        setExpanded(props.value.state === AssessmentState.COMPLETE)
    }, [props.value.state]);

    function getColor(){
        let color = moment().format('YYYY-MM-DD') === props.day.format('YYYY-MM-DD') ? theme.colors.success : theme.colors.contrast;
        if (props.value.state === AssessmentState.PENDING)
            color = theme.colors.warning;
        else if (props.value.state === AssessmentState.MISSING)
            color = theme.colors.alert;
        return color
    }

    return (
        <AccordionContainer color={getColor()}>
            <Accordion label={props.value.name} expanded={expanded} onClick={() => onClick()}>
                {props.value.state !== AssessmentState.MISSING && props.value.stats ?
                    props.value.stats.map((stat, i) => (
                        <StatDiv theme={theme} key={i}>
                            {`${stat.joint} ${stat.name}: ${stat.currValue}${stat.unit}\t Average Range of Motion: ${stat.goalValue}${stat.unit}`}
                        </StatDiv>
                    )) : null
                }
                {
                    props.value.state === AssessmentState.PENDING ?
                        <IonSpinner name="dots"/> : null
                }
            </Accordion>
            {props.value.state === AssessmentState.MISSING ?
                <RecordButton theme={theme} onClick={() => record(props.value.id)}>
                    <IonIcon icon={videocam}/>
                    Record
                </RecordButton> : null
            }
            {props.value.videoUrl !== undefined ?
                <VideoButton theme={theme} onClick={() => onWatch()}>
                    <IonIcon icon={film}/>
                    Watch
                </VideoButton> : null
            }
        </AccordionContainer>
    )
};

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
    top: 10px;
    right: 10px;
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
    top: 10px;
    right: 10px;
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

const StatDiv = styled.div`
    margin-left: 20px;
    font-size: ${({theme}: { theme: Theme }) => theme.subheaderFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.subheaderFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
`;

export default AssessmentComponent;
