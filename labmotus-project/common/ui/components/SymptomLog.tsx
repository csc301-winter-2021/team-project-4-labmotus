import React, {FunctionComponent, useContext} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, getThemeContext} from "../theme/Theme";
import Accordion from "./Accordion";
import SymptomProgressBar from "./SymptomProgressBar";
import CustomScrollbar from "../../../common/ui/components/CustomScrollbar"
import {Stats} from "../../types";

export interface SymptomLogProps {
    logs?: Stats[]
    shadow?: boolean
}

const SymptomLog: FunctionComponent<SymptomLogProps> = ({logs, shadow = false}) => {
    const theme = useContext(getThemeContext());

    function generateAccordions() {
        if (logs == null || logs.length === 0) {
            return (<NullDiv theme={theme}>
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

    return (<SymptomLogDiv className="symptom-log" theme={theme}>
        <CustomScrollbar>
            {generateAccordions()}
        </CustomScrollbar>
    </SymptomLogDiv>)
};

const SymptomLogDiv = styled.div`
    overflow: hidden;
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
    font-size: ${({theme}: { theme: Theme }) => theme.primaryFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.primaryFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
`;

export default SymptomLog;
