import React from 'react';
// @ts-ignore
import styled from 'styled-components';
import {Meta, Story} from '@storybook/react';
import SymptomLog, {SymptomLogProps} from "../../components/SymptomLog";
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

export default {
    title: 'Components/Symptom Log',
    component: SymptomLog,
    argTypes: {},
} as Meta;

const Template: Story<SymptomLogProps> = (args) => (
    <Container>
        <SymptomLog {...args}/>
    </Container>
);

export const Primary = Template.bind({});
Primary.args = {
    logs: [   
        {
            joint: "Trunk",
            angle: 120,
            goalAngle: 180,
        },
        {
            joint: "Pelvis",
            angle: -5,
            goalAngle: 0,
            minAngle: -10,
        },        
        {
            joint: "Flexion/Extension",
            angle: 85,
            goalAngle: 90,
        },        
        {
            joint: "Valgus/Varus",
            angle: 85,
            goalAngle: 90,
        },        
        {
            joint: "Plantarflexion",
            angle: 85,
            goalAngle: 90,
        },        
        {
            joint: "Dorsiflexion",
            angle: 85,
            goalAngle: 90,

        },
    ]
};

const Container = styled.div`
    .symptom-log {
        height: 300px;
    }
`;
