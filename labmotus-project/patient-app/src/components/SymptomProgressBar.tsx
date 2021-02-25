import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";

export interface SymptomProgressBarProps {
    label?: String;
    angle: number;
    goalAngle: number;
    minAngle?: number;
}

const SymptomProgressBar: FunctionComponent<SymptomProgressBarProps> = ({
                                                                            label = "Max Range of Motion",
                                                                            angle,
                                                                            goalAngle,
                                                                            minAngle = 0,
                                                                        }) => {

    const theme = React.useContext(ThemeContext);
    const percentage = (goalAngle - minAngle) > 0 ? (angle - minAngle) / (goalAngle - minAngle) : 0;

    return (<SymptomProgressBarDiv className="symptom-progress-bar" {...theme}>
        <TopDiv {...theme}>
            <LabelDiv {...theme}>
                {label}
            </LabelDiv>
            <CurrentAngleDiv {...theme}>
                {angle}&#176;
            </CurrentAngleDiv>
        </TopDiv>
        <BottomDiv {...theme}>
            <BarDiv {...theme}>
                <BarBackground {...theme}>
                    <Bar percentage={percentage} {...theme}/>
                </BarBackground>
            </BarDiv>
            <GoalAngleDiv {...theme}>
                {goalAngle}&#176;
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
    font-size: ${(props: Theme) => props.secondaryFontSize};
    font-family: ${(props: Theme) => props.secondaryFontFamily};
    color: ${(props: Theme) => props.colors.contrast};
`;

const CurrentAngleDiv = styled.span`
    font-size: ${(props: Theme) => props.primaryFontSize};
    font-family: ${(props: Theme) => props.primaryFontFamily};
    color: ${(props: Theme) => props.colors.contrast};
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
    background-color: ${(props: Theme) => props.colors.shade};
    overflow: hidden;
    border-radius: 9999px;
    height: 50%;
    width: 100%;
`;

interface PercentageProps {
    percentage: number;
}

const Bar = styled.div`
    background-color: ${(props: Theme) => props.colors.primary};
    border-radius: 9999px;
    height: 100%;
    width: 100%;
    transform: translate(-${({percentage}: PercentageProps) => ((1 - percentage) * 100).toFixed(0)}%, 0%);
`;

const GoalAngleDiv = styled.div`
    flex: 2.5;
    text-align: end;
    font-size: ${(props: Theme) => props.secondaryFontSize};
    font-family: ${(props: Theme) => props.secondaryFontFamily};
    color: ${(props: Theme) => props.colors.shade};
`;

export default SymptomProgressBar;
