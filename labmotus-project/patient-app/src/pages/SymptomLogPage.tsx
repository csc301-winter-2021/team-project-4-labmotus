import React, {FunctionComponent, SyntheticEvent, useEffect, useRef, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import {IonSpinner} from "@ionic/react";
import SymptomInstance from "../../../common/ui/components/SymptomInstance";
import {Assessment, AssessmentState} from "../../../common/types/types";
import moment, {Moment} from "moment";
import API, { getAPIContext } from "../api/API";
import {useHistory, useParams} from "react-router";

export interface SymptomLogPageProps {
}

const dateFormat = 'YYYY-MM-DD';

const SymptomLogPage: FunctionComponent<SymptomLogPageProps> = ({}) => {
    const UseAPI: API = React.useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const [data, setData] = useState<{ [key: string]: Assessment[] }>({});
    const [graphData, setGraphData] = useState([]);
    const [graphKeys, setGraphKeys] = useState<Set<string>>(new Set());
    const [moving, setMoving] = useState(true);

    const containerRef = useRef();
    const offset = useRef<number>(0);
    const last = useRef<number>(0);
    const page = useRef<number>(0);
    const [shift, setShift] = useState<[Moment, number] | null>(null);

    const history = useHistory();
    const params: { date: string } = useParams();
    const day = useRef(moment());

    if (params.date)
        day.current = moment(params.date, dateFormat);
    const week = moment(day.current).startOf('week');
    const index = day.current.day() + 1;

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
            const newDay = date.day() + 1;
            setShift([date.startOf('week'), newDay]);
        }
    }

    function updateData(newWeek: Moment, newIndex: number) {
        UseAPI.getCurrUsersAssessments(newWeek).then(((assessments: Assessment[]) => {
            const assessmentsByDay: { [key: string]: Assessment[] } = {};
            for (let i = 0; i < assessments.length; i++) if (assessments[i].state === AssessmentState.COMPLETE) {
                const key = assessments[i].date.format(dateFormat);
                if (!assessmentsByDay.hasOwnProperty(key))
                    assessmentsByDay[key] = [];
                assessmentsByDay[key].push(assessments[i]);
                assessments[i].stats.forEach(value => graphKeys.add(value.name));
            }
            const newGraphData = [];
            for (const dayAssessments of Object.values(assessmentsByDay)) if (dayAssessments.length > 0) {
                const dict: { [key: string]: number } = {date: moment(dayAssessments[0].date).startOf('day').unix()};
                for (let i = 0; i < dayAssessments.length; i++) {
                    for (let j = 0; j < dayAssessments[i].stats.length; j++) {
                        const stat = dayAssessments[i].stats[j];
                        const goal = stat.goalValue;
                        const min = stat.minValue ? stat.minValue : 0;
                        dict[stat.name] = (goal === min) ? 1 : (stat.currValue - min) / (goal - min);
                    }
                }
                newGraphData.push(dict);
            }
            // @ts-ignore
            setData({...data, ...assessmentsByDay});
            setGraphData([...graphData, ...newGraphData].sort((a: { date: number }, b: { date: number }) => a.date - b.date));
            setGraphKeys(graphKeys);
            setMoving(false);
            goto(newWeek, newIndex);
        })).catch(reason => {
            console.error(reason)
        })
    }

    useEffect(() => {
        if (Object.keys(data).length === 0) {
            updateData(week, index)
        }
    }, [data]);

    function goto(newWeek: Moment, newIndex: number) {
        history.push(`/home/${moment(newWeek).add(newIndex - 1, 'd').format(dateFormat)}`)
    }

    useEffect(() => {

        if (!moving) {
            const container: {
                style: { transform: string, transition: string }
                addEventListener(event: string, callback: () => void, options: { once: boolean }): void;
            } = containerRef.current;
            if (container != null) {
                container.style.transition = `transform 0.4s`;
                container.style.transform = `translate3d(${page.current === 0 ? '0' : (page.current > 0 ? '-33.3333%' : '33.3333%')}, 0, 0)`;
                container.addEventListener("transitionend", () => update(), {once: true});
            }
        }
    }, [moving, shift]);

    function update() {
        if (shift != null) {
            const [nextWeek, nextIndex] = shift;
            if (!data.hasOwnProperty(nextWeek.format(dateFormat))) {
                updateData(nextWeek, nextIndex)
            } else {
                goto(nextWeek, nextIndex)
            }
            page.current = 0;
            setShift(null);
        } else if (week !== null && page.current !== 0) {
            const newWeek = moment(day.current).startOf('week');
            const newIndex = day.current.day() + 1;
            const currIndex = newIndex + page.current;
            const nextWeek = moment(newWeek);
            if (currIndex === 8 || currIndex === 0) {
                nextWeek.add(currIndex === 8 ? 7 : -7, 'd');
                if (!data.hasOwnProperty(nextWeek.format(dateFormat))) {
                    updateData(nextWeek, (currIndex + 6) % 7 + 1)
                } else {
                    goto(nextWeek, (currIndex + 6) % 7 + 1);
                }
            } else {
                goto(newWeek, (currIndex + 6) % 7 + 1);
            }
            page.current = 0;
        }
    }

    useEffect(() => {
        if (day.current !== null) {
            const container: { style: { transform: string, transition: string } } = containerRef.current;
            if (container != null) {
                container.style.transition = `unset`;
                container.style.transform = `translate3d(0, 0, 0)`;
            }
        }
    }, [index, data]);

    function generateInstances() {
        if (week !== null) {
            const newDay = moment(week).add(index - 1, 'd');
            const dayData = data[newDay.format(dateFormat)];
            return <InstanceDiv>
                <SymptomInstance changeDay={setDate} date={newDay} graphData={graphData}
                                 graphKeys={graphKeys} data={dayData}/>
            </InstanceDiv>
        } else {
            return <InstanceDiv>
                <IonSpinner/>
            </InstanceDiv>
        }
    }

    function dragStart(e: SyntheticEvent & { clientX: number, dataTransfer: any }) {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        click(e?.clientX)
    }

    function touchStart(e: SyntheticEvent & { touches: { clientX: number }[] }) {
        click(e?.touches[0]?.clientX)
    }

    function click(x: number) {
        offset.current = x;
        last.current = x;
        setMoving(true);
    }

    function release(e: SyntheticEvent & { target: { clientWidth: number } }) {
        setMoving(false);
        const pct = 3 * (last.current - offset.current) / e.target.clientWidth;
        if (pct > 0.5) {
            page.current = -1;
        } else if (pct < -0.5) {
            page.current = 1;
        }
    }

    function drag(x: number) {
        if (moving) {
            const container: { style: { transform: string, transition: string } } = containerRef.current;
            const current = x;
            if (current != null && container != null && current !== 0) {
                container.style.transition = 'unset';
                container.style.transform = `translate3d(${current - offset.current}px, 0, 0)`;
                last.current = current;
            }
        }
    }

    function onDrag(e: SyntheticEvent & { clientX: number }) {
        drag(e?.clientX)
    }

    function touchMove(e: SyntheticEvent & { touches: { clientX: number }[] }) {
        drag(e?.touches[0]?.clientX)
    }


    return (<SymptomLogPageDiv className="symptom-log-page" theme={theme}>
        <InnerDiv ref={containerRef} onTouchMove={touchMove} onTouchStart={touchStart} onTouchEnd={release}
                  onDragStart={dragStart} onDrag={onDrag} onDragEnd={release} draggable>
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
        background: ${({theme}: { theme: Theme }) => theme.colors.contrast};
    }
    .swiper-pagination-bullet-active {
        background: ${({theme}: { theme: Theme }) => theme.colors.primary};
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
