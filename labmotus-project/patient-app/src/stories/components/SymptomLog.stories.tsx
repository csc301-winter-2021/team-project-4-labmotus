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
        joint: "Shoulder",
        angle: 85,
        goalAngle: 90,
        },
        {
            joint: "Knee",
            angle: 120,
            goalAngle: 180,
        },
        {
            joint: "Hip",
            angle: -5,
            goalAngle: 0,
            minAngle: -10,
        },        
        {
            joint: "Trunk",
            angle: 85,
            goalAngle: 90,
        },        
        {
            joint: "Ankle Plantar",
            angle: 85,
            goalAngle: 90,
        },        
        {
            joint: "Knee Valgus",
            angle: 85,
            goalAngle: 90,
        },        
        {
            joint: "Lateral Trunk",
            angle: 85,
            goalAngle: 90,
        },        
        {
            joint: "Foot Position",
            angle: 45,
            goalAngle: 30,
        },
    ]
};
// non-angle measurements:
// Symmetric initial foot contact (Front View) – If one-foot lands before the other or if one-foot lands heel to toe and the other lands tow to heel, score NO. If the feet land symmetrically, score YES.
// Stance width – Wide (Front View) – Once the entire foot is in contact with the ground, draw a line down from the tip of the shoulders, If the line on the side of the test leg is inside the foot of the test leg then greater than shoulder width (side), score YES. If the test foot is internally or externally rotated, grade the stance width based on heel placement.
// everything in the squat pattern table
const Container = styled.div`
    .symptom-log {
        height: 300px;
    }
`;
