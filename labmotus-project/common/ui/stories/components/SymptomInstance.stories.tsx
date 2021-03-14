import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import SymptomInstance, {SymptomInstanceProps} from "../../components/SymptomInstance";
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
import moment from "moment";

export default {
    title: 'Components/Symptom Instance',
    component: SymptomInstance,
    argTypes: {
        date: {
            defaultValue: Date.now(),
            control: {
                type: "date"
            }
        },
        logs: {
            defaultValue: [
                {
                    joint: "Knee",
                    angle: 120,
                    goalAngle: 180,
                },
                {
                    joint: "Shoulder",
                    angle: 85,
                    goalAngle: 90,
                },
                {
                    joint: "Hip",
                    angle: -5,
                    goalAngle: 0,
                    minAngle: -10,
                }
            ]
        }
    }
} as Meta;

const Template: Story<SymptomInstanceProps> = ({date, ...args}) => <RootDiv ref={(ref: any) => {
    if (ref?.parentNode) {
        ref.parentNode.style.width = "100%";
        ref.parentNode.style.height = "100%";
    }
}}>
    <SymptomInstance date={moment(date)} {...args} />
</RootDiv>;

const RootDiv = styled.div`
    width: 100%;
    height: 100%;
    .symptom-instance {
        width: 100%;
        height: 100%;
    }
`;

export const Default = Template.bind({});
Default.args = {};
