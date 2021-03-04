import React, {FunctionComponent, SyntheticEvent, useEffect, useRef, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
import {IonSpinner} from "@ionic/react";
import SymptomInstance from "../components/SymptomInstance";
import {Assessment} from "../../../common/types/types";
import moment, {Moment} from "moment";
import {APIContext} from "../api/API";

export interface SymptomLogPageProps {
}

const dateFormat = 'YYYY-MM-DD';

const SymptomLogPage: FunctionComponent<SymptomLogPageProps> = ({}) => {
    const API = React.useContext(APIContext);
    const getWeekData = API.getAssessments;
    const theme = React.useContext(ThemeContext);

    const [week, setWeek] = useState<Moment | null>(null);
    const [data, setData] = useState<{ [key: string]: Assessment }>({});
    const [graphData, setGraphData] = useState([]);
    const [graphKeys, setGraphKeys] = useState<Set<string>>(new Set());
    const [index, setIndex] = useState(1);
    const [moving, setMoving] = useState(true);

    const now = moment();
    const thisWeek = moment(now).startOf('week');
    const containerRef = useRef();
    const offset = useRef<number>(0);
    const last = useRef<number>(0);
    const page = useRef<number>(0);
    const [shift, setShift] = useState<[Moment, number] | null>(null);

    function setDate(datetime: Moment) {
        const date = moment(datetime).startOf('day');
        page.current = 0;
        if (week === null) {
            page.current = 1;
        } else {
            const curr = moment(week).add(index - 1, 'd').startOf('day');
            if (curr.unix() !== date.unix()) {
                const after = curr.unix() < date.unix();
                page.current = after ? 1 : -1;
            }
        }
        if (page.current !== 0) {
            const day = date.day() + 1;
            setShift([date.startOf('week'), day]);
        }
    }

    function updateData(week: Moment, index: number) {
        getWeekData(week).then(((assessments: Assessment[]) => {
            // @ts-ignore
            setData({...data, ...Object.fromEntries(assessments.map(assessment => [assessment.date.format(dateFormat), assessment]))});
            setGraphData([...graphData, ...assessments.map((assessment) => {
                return {
                    date: assessment.date.unix(),
                    ...Object.fromEntries(assessment.stats.map(stat => {
                        const goal = stat.goalValue;
                        const min = stat.minValue ? stat.minValue : 0;
                        const pct = (goal == min) ? 1 : (stat.currValue - min) / (goal - min);
                        return [stat.name, pct];
                    }))
                };
            })].sort((a: { date: number }, b: { date: number }) => a.date - b.date));
            assessments.forEach(assessment => assessment.stats.forEach(({name}) => graphKeys.add(name)));
            setGraphKeys(graphKeys);
            setMoving(false);
            setWeek(week);
            setIndex(index);
        }))
    }

    useEffect(() => {
        if (Object.keys(data).length === 0) {
            updateData(thisWeek, now.day() + 1)
        }
    }, [data]);

    useEffect(() => {
        if (!moving) {
            const container: {
                style: { transform: string, transition: string }
                addEventListener(event: string, callback: () => void, options: { once: boolean }): void;
            } = containerRef.current;
            if (container != null) {
                container.style.transition = `transform 0.4s`;
                container.style.transform = `translate3d(${page.current === 0 ? '0' : (page.current > 0 ? '-33.3333%' : '33.3333%')}, 0, 0)`;
                container.addEventListener("transitionend", () => {
                    if (shift != null) {
                        const [nextWeek, nextIndex] = shift;
                        if (!data.hasOwnProperty(nextWeek.format(dateFormat))) {
                            updateData(nextWeek, nextIndex)
                        } else {
                            setWeek(nextWeek);
                            setIndex(nextIndex);
                        }
                        page.current = 0;
                        setShift(null);
                    } else if (week !== null && page.current !== 0) {
                        const currIndex = index + page.current;
                        const nextWeek = moment(week);
                        if (currIndex === 8 || currIndex === 0) {
                            nextWeek.add(currIndex === 8 ? 7 : -7, 'd');
                            if (!data.hasOwnProperty(nextWeek.format(dateFormat))) {
                                updateData(nextWeek, (currIndex + 6) % 7 + 1)
                            } else {
                                setWeek(nextWeek);
                            }
                        }
                        setIndex((currIndex + 6) % 7 + 1);
                        page.current = 0;
                    }
                }, {once: true});
            }
        }
    }, [moving, shift]);

    useEffect(() => {
        if (week !== null && data.hasOwnProperty(week.format(dateFormat))) {
            const container: { style: { transform: string, transition: string } } = containerRef.current;
            if (container != null) {
                container.style.transition = `unset`;
                container.style.transform = `translate3d(0, 0, 0)`;
            }
        }
    }, [index, data]);

    function generateInstances() {
        if (week !== null) {
            const day = moment(week).add(index - 1, 'd');
            const weekData = data[day.format(dateFormat)];
            return <InstanceDiv>
                <SymptomInstance changeDay={setDate} date={day} graphData={graphData}
                                 graphKeys={graphKeys} {...weekData}/>
            </InstanceDiv>
        } else {
            return <InstanceDiv>
                <IonSpinner/>
            </InstanceDiv>
        }
    }

    function dragStart(e: SyntheticEvent & { clientX: number, dataTransfer: any }) {
        offset.current = e?.clientX;
        last.current = e?.clientX;
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        setMoving(true);
    }

    function onDrag(e: SyntheticEvent & { clientX: number, target: { clientWidth: number } }) {
        if (moving) {
            const container: { style: { transform: string, transition: string } } = containerRef.current;
            const current = e?.clientX;
            if (current != null && container != null && current != 0) {
                container.style.transition = 'unset';
                container.style.transform = `translate3d(${current - offset.current}px, 0, 0)`;
                last.current = current;
            }
        }
    }

    function dragEnd(e: SyntheticEvent) {
        setMoving(false);
        const target: EventTarget & { clientWidth: number } = e.target as EventTarget & { clientWidth: number };
        const pct = 3 * (last.current - offset.current) / target.clientWidth;
        if (pct > 0.5) {
            page.current = -1;
        } else if (pct < -0.5) {
            page.current = 1;
        }
    }


    return (<SymptomLogPageDiv className="symptom-log-page" {...theme}>
        <InnerDiv ref={containerRef} onDrag={onDrag} onDragStart={dragStart} onDragEnd={dragEnd} draggable>
            <SpinnerDiv>
                <IonSpinner/>
            </SpinnerDiv>
            <InstanceContainer>
                {generateInstances()}
            </InstanceContainer>
            <SpinnerDiv>
                <IonSpinner/>
            </SpinnerDiv>
        </InnerDiv>
    </SymptomLogPageDiv>)
};

const SymptomLogPageDiv = styled.div`
    overflow: hidden;
    width: 100%;
    height: 100%;
    .swiper-pagination {
        top: 0;
        bottom: unset;
    }
    .swiper-pagination-bullet {
        width: 7px;
        height: 7px;
        background: ${(props: Theme) => props.colors.contrast};
    }
    .swiper-pagination-bullet-active {
        background: ${(props: Theme) => props.colors.primary};
    }
    .swiper-wrapper {
        margin-top: 8%;
    }
    ion-slides {
        width: 100% !important;
        height: 100% !important;
    }
`;

const InnerDiv = styled.div`
    position: relative;
    left: -100%;
    top: 0;
    width: 300%;
    height: 100%;
    display: flex;
    flex-direction: row;
`;

const SpinnerDiv = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const InstanceDiv = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .symptom-instance {
        width: 100%;
        height: 100%;
    }
`;

const InstanceContainer = styled.div`
    flex: 1;
    flex-direction: row;
    align-items: center;
`;

export default SymptomLogPage;
