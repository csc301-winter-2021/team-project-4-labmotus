import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import SymptomLogPage, {SymptomLogPageProps} from "../../pages/SymptomLogPage";
// @ts-ignore
import styled from 'styled-components';
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import {Assessment} from "../../../../common/types/Types";
import moment, {Moment} from "moment";

export default {
    title: 'Pages/Symptom Log Page',
    component: SymptomLogPage,
} as Meta;

const Template: Story<SymptomLogPageProps> = (args) => <RootDiv ref={(ref: any) => {
    if (ref?.parentNode) {
        ref.parentNode.style.width = "100%";
        ref.parentNode.style.height = "100%";
    }
}}>
    <SymptomLogPage {...args} getWeekData={getWeekData}/>
</RootDiv>;

const RootDiv = styled.div`
    width: 100%;
    height: 100%;
`;

async function getWeekData(week: Moment = moment()): Promise<Assessment[]> {
    const data: Assessment[] = [];
    for (let i = 0; i < 7; i++) {
        const date = moment(week).startOf('week').add(i, 'd');
        if (i % 2 == 0)
            data.push({
                id: "",
                patientId: "",
                date: date,
                stats: [
                    {
                        name: "Knee",
                        joint: "Knee",
                        currValue: Math.floor(Math.random() * 180),
                        goalValue: 180,
                    },
                    {
                        name: "Shoulder",
                        joint: "Shoulder",
                        currValue: Math.floor(Math.random() * 90),
                        goalValue: 90,
                    },
                    {
                        name: "Hip",
                        joint: "Hip",
                        currValue: -5,
                        goalValue: 0,
                        minValue: -10,
                    }
                ]
            })
    }
    return data;
}

export const Default = Template.bind({});
Default.args = {};
