import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
// @ts-ignore
import Accordion from "./Accordion";
import SymptomProgressBar, {SymptomProgressBarProps} from "./SymptomProgressBar";

export interface SymptomLogEntry extends SymptomProgressBarProps {
    joint: string;
}

export interface SymptomLogProps {
    logs: SymptomLogEntry[]
    shadow?: boolean
}

const SymptomLog: FunctionComponent<SymptomLogProps> = ({logs, shadow = false}) => {
    const theme = React.useContext(ThemeContext);

    function generateAccordions() {
        if (logs.length === 0) {
            return (<NullDiv {...theme}>
                Nothing To See Here
            </NullDiv>)
        } else {
            return logs.map(({joint, ...props}, index) => (
                <Accordion label={joint} shadow={shadow} key={index}>
                    <AccordionDiv>
                        <SymptomProgressBar {...props}/>
                    </AccordionDiv>
                </Accordion>
            ))
        }
    }

    return (<SymptomLogDiv className="symptom-log">
        {generateAccordions()}
    </SymptomLogDiv>)
};

const SymptomLogDiv = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
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
