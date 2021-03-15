import {FunctionComponent, useState, useEffect, useContext} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, getThemeContext} from "../theme/Theme";
import SymptomLog from "./SymptomLog";
import {Assessment, Stats} from "../../types";
import moment, {Moment} from "moment";
import {CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {IonIcon} from "@ionic/react";
import {chevronForward} from "ionicons/icons";
import {useHistory} from "react-router";

import {DateDisplay} from "./DateDisplay";

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
    const theme: Theme = useContext(getThemeContext());
    const colors = theme.colors.cycle;
    const [stats, setStats] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const newStats: Stats[] = [];
        data?.forEach(assessment => {
            assessment.stats.forEach(stat => newStats.push(stat))
        });
        setStats(newStats);
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

    return (<SymptomInstanceDiv className="symptom-instance" theme={theme}>
        <HeaderDiv theme={theme}>
            {date?.format('MMMM Do YYYY')}
        </HeaderDiv>
        <DateChangeDiv theme={theme}>
            <DateDisplay displayFormat="DDD" dayShortNames={Array(7).fill("Select Date")} date={date}
                         changeDay={changeDay}/>
            <div onClick={toToday}>Go to Today</div>
        </DateChangeDiv>
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

const DateChangeDiv = styled.div`
  font-size: ${({theme}: { theme: Theme }) => theme.subheaderFontSize};
  font-family: ${({theme}: { theme: Theme }) => theme.subheaderFontFamily};
  color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
  text-align: center;
  margin-bottom: 2%;

  div {
    margin-left: 10px;
  }
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
