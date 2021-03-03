import React, {FunctionComponent, useEffect, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
// @ts-ignore
import Accordion from "./Accordion";
import SymptomProgressBar from "./SymptomProgressBar";
import Scrollbar from "react-scrollbars-custom";
import {Stats} from "../../../common/types/types";
import ReactPlayer from "react-player";

export interface SymptomLogProps {
    logs?: Stats[]
    shadow?: boolean
}

const SymptomLog: FunctionComponent<SymptomLogProps> = ({logs, shadow = false}) => {
    const theme = React.useContext(ThemeContext);
    const [expanded, setExpanded] = useState([]);
    const [v_expanded, setVExpanded] = useState([]);
    const [playing, setPlaying] = useState(-1);
    useEffect(() => {
        if (logs != null) {
            setPlaying(-1);
            setExpanded(logs.map(() => false));
            setVExpanded(logs.map(() => false));
        }
    }, [logs]);

    function handleExpand(ex: boolean, index: number) {
        const nex = [...expanded];
        nex[index] = ex;
        setExpanded(nex);
        if (!ex && playing === index) {
            setPlaying(-1);
        } else if (!logs[index].videoUrl) {
            setPlaying(index);
        }
        if (ex) {
            const nvex = [...expanded];
            nvex[index] = ex;
            setVExpanded(nvex);
        }
    }

    function handleVisualExpand(ex: boolean, index: number) {
        if (!ex) {
            const nvex = [...expanded];
            nvex[index] = ex;
            setVExpanded(nvex);
        }
    }

    function generateAccordions() {
        if (logs == null || logs.length === 0) {
            return (<NullDiv {...theme}>
                No Assessments Today
            </NullDiv>)
        } else {
            return logs.map(({joint, ...props}, index) => (
                <Accordion label={joint} shadow={shadow} key={index}>
                    <AccordionDiv>
                        <SymptomProgressBar {...props}/>
                        <VideoContainer>
                            <Accordion label="Video" labelFont="secondary" shadow={shadow} expanded={expanded[index]}
                                       onClick={(ex) => handleExpand(ex, index)}
                                       onExpandEnd={(ex) => handleVisualExpand(ex, index)}>
                                {v_expanded[index] ?
                                    <ReactPlayer width="100%" height="100%" pip
                                                 url={props.videoUrl ? props.videoUrl : "https://youtu.be/dQw4w9WgXcQ"}
                                                 playing={playing === index} onPlay={() => setPlaying(index)}
                                                 onPause={() => setPlaying(-1)}/>
                                    : null}
                            </Accordion>
                        </VideoContainer>
                    </AccordionDiv>
                </Accordion>
            ))
        }
    }

    return (<SymptomLogDiv className="symptom-log" {...theme}>
        <Scrollbar>
            {generateAccordions()}
        </Scrollbar>
    </SymptomLogDiv>)
};

const SymptomLogDiv = styled.div`
    overflow: hidden;
    .ScrollbarsCustom-Track {
        width: 6px !important;
        background-color: ${(props: Theme) => props.colors.shade} !important;
    }
    .ScrollbarsCustom-Thumb {
        background-color: ${(props: Theme) => props.colors.primary} !important;
    }
`;

const VideoContainer = styled.div`
    ion-card-header {
        padding: 0;
        span {
            font-size: ${(props: Theme) => props.subheaderFontSize};
            font-family: ${(props: Theme) => props.subheaderFontFamily};
        }
    }
`;

const AccordionDiv = styled.div`
    margin-left: 5%;
`;

const NullDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: Theme) => props.primaryFontSize};
    font-family: ${(props: Theme) => props.primaryFontFamily};
    color: ${(props: Theme) => props.colors.contrast};
`;

export default SymptomLog;
