import React, {FunctionComponent, useEffect} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
import SymptomLog from "./SymptomLog";
import {Assessment, Stats} from "../../../common/types/types";
import moment, {Moment} from "moment";
import {CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {IonIcon} from "@ionic/react";
import {chevronForward} from "ionicons/icons";
import {useHistory} from "react-router";

import {DateDisplay} from "./DateDisplay"
import { IonButton } from "@ionic/react";
export interface SymptomInstanceProps {
    date: Moment;
    data?: Assessment[];
    graphData?: any[];
    graphKeys?: Set<string>;
    changeDay?: (newDay: Moment) => void;
}

const SymptomInstance: FunctionComponent<SymptomInstanceProps> = ({
                                                                      date, data, graphData = [],
                                                                      graphKeys = new Set(), changeDay
                                                                  }) => {
    const theme = React.useContext(ThemeContext);
    const colors = theme.colors.cycle;
    const [stats, setStats] = React.useState([]);
    const history = useHistory();

    useEffect(() => {
        const new_stats: Stats[] = [];
        data?.forEach(assessment => {
            assessment.stats.forEach(stat => new_stats.push(stat))
        });
        setStats(new_stats);
    }, [data]);

    function colorLabel(ref: any) {
        const element: HTMLDivElement = ref;
        if (element != null) {
            const tags = element.getElementsByTagName("tspan");
            const day = date.format("ddd");
            [...tags].forEach(tag => tag.style.fill = 'unset');
            const ctag = [...tags].filter(tag => tag.textContent === day);
            if (ctag.length > 0) {
                ctag[0].style.fill = theme.colors.primary;
            }
        }
    }

    function toToday() {
        if (changeDay !== undefined) {
            changeDay(moment());
        }
    }

    function viewAssessment() {
        history.push(`/assessment/${date.format("YYYY-MM-DD")}`)
    }

    return (<SymptomInstanceDiv className="symptom-instance"  theme={theme}>
        <HeaderDiv theme={theme}>
            {date?.format('MMMM Do YYYY')}
        </HeaderDiv>
        <DateDisplay date={date} changeDay={changeDay}></DateDisplay>
        <div {...theme} onClick={toToday}>Go to today</div>
        <GraphDiv ref={colorLabel}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                    <XAxis dataKey="date"
                           domain={[moment(date).startOf("week").unix(), moment(date).endOf("week").subtract(1, 'd').unix() + 1]}
                           type="number"
                           ticks={[...Array(7).keys()].map((i) => (
                               moment(date).startOf("week").add(i, 'd').unix()
                           ))}
                           allowDataOverflow
                           tickFormatter={(value) => moment.unix(value).format("ddd")}
                           interval={0}
                           style={{fontSize: theme.secondaryFontSize}}
                           padding={{left: 10, right: 10}}
                    />
                    <Tooltip labelFormatter={(value) => moment.unix(value).format("ddd, MMM D")}
                             formatter={(value: number) => `${(value * 100).toFixed(0)}%`}/>
                    <CartesianGrid stroke={theme.colors.shade} strokeDasharray="3 3"/>
                    <YAxis hide domain={[0, 1]}/>
                    <ReferenceLine x={moment(date).startOf('day').unix()} stroke={theme.colors.primary}/>
                    {[...graphKeys].map((key, index) => {
                        return (
                            <Line type="monotone" key={index} dataKey={key} stroke={colors[index % colors.length]}/>
                        )
                    })}
                </LineChart>
            </ResponsiveContainer>
        </GraphDiv>
        <ViewAssessmentDiv>
            <ViewAssessmentButton onClick={viewAssessment} theme={theme}>
                View Assessments
                <IonIcon icon={chevronForward}/>
            </ViewAssessmentButton>
        </ViewAssessmentDiv>
        <SymptomLog logs={stats}/>
    </SymptomInstanceDiv>)
};

const SymptomInstanceDiv = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 10%;
    padding-left: 7%;
    padding-right: 7%;
    .symptom-log {
        flex: 1;
    }
`;

const HeaderDiv = styled.div`
    font-size: ${({theme}: { theme: Theme }) => theme.headerFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.headerFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast};
    text-align: center;
    margin-bottom: 2%;
`;

const GraphDiv = styled.div`
    flex: 0.7;
    padding: 2%;
`;

const ViewAssessmentDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 3%;
    margin-bottom: 3%;
`;

const ViewAssessmentButton = styled.div`
    font-size: ${({theme}: { theme: Theme }) => theme.primaryFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.primaryFontFamily};
    color: ${({theme}: { theme: Theme }) => theme.colors.contrast}; 
    font-weight: bold;
    display: flex;
    align-items: center;
    cursor: pointer;
`;

export default SymptomInstance;
