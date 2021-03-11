import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";

export interface SymptomProgressBarProps {
    label?: string;
    currValue: number;
    goalValue: number;
    minValue?: number;
    unit: string;
}

const SymptomProgressBar: FunctionComponent<SymptomProgressBarProps> = ({
                                                                            label = "Max Range of Motion",
                                                                            currValue,
                                                                            goalValue,
                                                                            minValue = 0,
                                                                            unit
                                                                        }) => {

    const theme = React.useContext(getThemeContext());
    const percentage = (goalValue - minValue) > 0 ? (currValue - minValue) / (goalValue - minValue) : 0;

    return (<SymptomProgressBarDiv className="symptom-progress-bar" theme={theme}>
        <TopDiv theme={theme}>
            <LabelDiv theme={theme}>
                {label}
            </LabelDiv>
            <CurrentAngleDiv theme={theme}>
                {currValue}{unit}
            </CurrentAngleDiv>
        </TopDiv>
        <BottomDiv theme={theme}>
            <BarDiv theme={theme}>
                <BarBackground theme={theme}>
                    <Bar percentage={percentage} theme={theme}/>
                </BarBackground>
            </BarDiv>
            <GoalAngleDiv theme={theme}>
                {goalValue}{unit}
            </GoalAngleDiv>
        </BottomDiv>
    </SymptomProgressBarDiv>)
};

const SymptomProgressBarDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const TopDiv = styled.div`
    display: flex;
    flex-direction: row;
`;

const LabelDiv = styled.div`
    flex: 1;
    font-size: ${({theme}: { theme: Theme }) => theme.secondaryFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.secondaryFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
`;

const CurrentAngleDiv = styled.span`
    font-size: ${({theme}: { theme: Theme }) => theme.primaryFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.primaryFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
`;

const BottomDiv = styled.div`
    display: flex;
    flex-direction: row;
`;

const BarDiv = styled.div`
    flex: 8;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BarBackground = styled.div`
    background-color: ${({theme}: { theme: Theme }) => theme.colors.shade};
    overflow: hidden;
    border-radius: 9999px;
    height: 50%;
    width: 100%;
`;

interface PercentageProps {
    percentage: number;
}

const Bar = styled.div`
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    border-radius: 9999px;
    height: 100%;
    width: 100%;
    transform: translate(-${({percentage}: PercentageProps) => ((1 - percentage) * 100).toFixed(0)}%, 0%);
`;

const GoalAngleDiv = styled.div`
    flex: 2.5;
    text-align: end;
    font-size: ${({theme}: { theme: Theme }) => theme.secondaryFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.secondaryFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.shade};
`;

export default SymptomProgressBar;
