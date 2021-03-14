import {FunctionComponent, useContext} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
// @ts-ignore
import Accordion from "../../../common/ui/components/Accordion";
import SymptomProgressBar from "../../../common/ui/components/SymptomProgressBar";
import Scrollbar from "react-scrollbars-custom";
import {Stats} from "../../../common/types/types";

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
        <Scrollbar>
            {generateAccordions()}
        </Scrollbar>
    </SymptomLogDiv>)
};

const SymptomLogDiv = styled.div`
    overflow: hidden;
    .ScrollbarsCustom-Track {
        width: 6px !important;
        background-color: ${({theme}: { theme: Theme }) => theme.colors.shade} !important;
    }
    .ScrollbarsCustom-Thumb {
        background-color: ${({theme}: { theme: Theme }) => theme.colors.primary} !important;
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
    font-size: ${({theme}: { theme: Theme }) => theme.primaryFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.primaryFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
`;

export default SymptomLog;
