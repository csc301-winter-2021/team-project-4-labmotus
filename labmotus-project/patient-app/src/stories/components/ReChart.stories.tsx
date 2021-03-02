import React from 'react';
import {Meta, Story} from '@storybook/react';
import {IonButton} from '@ionic/react';
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

import {CartesianGrid, Line, LineChart, Tooltip, XAxis} from "recharts";

export default {
    title: 'Components/ReChart',
    component: IonButton,
    argTypes: {},
} as Meta;

export interface ChartProps {

}

const Template: Story<ChartProps> = () => (
    <LineChart
        width={400}
        height={400}
        data={[
            {name: 'Page A', uv: 1000, pv: 2400, amt: 2400, uvError: [75, 20]},
            {name: 'Page B', uv: 300, pv: 4567, amt: 2400, uvError: [90, 40]},
            {name: 'Page C', uv: 280, pv: 1398, amt: 2400, uvError: 40},
            {name: 'Page D', uv: 200, pv: 9800, amt: 2400, uvError: 20},
            {name: 'Page E', uv: 278, pv: null, amt: 2400, uvError: 28},
            {name: 'Page F', uv: 189, pv: 4800, amt: 2400, uvError: [90, 20]},
            {name: 'Page G', uv: 189, pv: 4800, amt: 2400, uvError: [28, 40]},
            {name: 'Page H', uv: 189, pv: 4800, amt: 2400, uvError: 28},
            {name: 'Page I', uv: 189, pv: 4800, amt: 2400, uvError: 28},
            {name: 'Page J', uv: 189, pv: 4800, amt: 2400, uvError: [15, 60]},
        ]}
        margin={{top: 5, right: 20, left: 10, bottom: 5}}
    >
        <XAxis dataKey="name"/>
        <Tooltip/>
        <CartesianGrid stroke="#f5f5f5"/>
        <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0}/>
        <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1}/>
    </LineChart>
);
export const Primary = Template.bind({});
Primary.args = {};
