import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
// @ts-ignore
import Accordion from "./Accordion";
import SymptomProgressBar from "./SymptomProgressBar";
import Scrollbar from "react-scrollbars-custom";
import {Stats} from "../../../common/types";

export interface SymptomLogProps {
    logs?: Stats[]
    shadow?: boolean
}

const SymptomLog: FunctionComponent<SymptomLogProps> = ({logs, shadow = false}) => {
    const theme = React.useContext(ThemeContext);

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
