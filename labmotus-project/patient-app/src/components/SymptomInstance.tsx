import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
import SymptomLog from "./SymptomLog";
import {Stats} from "../../../common/types/types";
import moment, {Moment} from "moment";
import {CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export interface SymptomInstanceProps {
    date: Moment;
    stats: Array<Stats>;
    graphData: any[];
    graphKeys: Set<string>;
    changeDay?: (newDay: Moment) => void;
}

const SymptomInstance: FunctionComponent<SymptomInstanceProps> = ({
                                                                      date, stats, graphData,
                                                                      graphKeys, changeDay
                                                                  }) => {
    const theme = React.useContext(ThemeContext);
    const colors = theme.colors.cycle;

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

    return (<SymptomInstanceDiv className="symptom-instance" {...theme}>
        <HeaderDiv {...theme} onClick={toToday}>
            {date?.format('MMMM Do YYYY')}
        </HeaderDiv>
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
    font-size: ${(props: Theme) => props.headerFontSize};
    font-family: ${(props: Theme) => props.headerFontFamily};
    color: ${(props: Theme) => props.colors.contrast};
    text-align: center;
    margin-bottom: 2%;
`;

const GraphDiv = styled.div`
    flex: 0.7;
    padding: 2%;
    margin-bottom: 10%;
`;

export default SymptomInstance;
