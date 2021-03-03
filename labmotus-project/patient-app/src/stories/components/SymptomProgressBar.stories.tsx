import React from 'react';
import {Meta, Story} from '@storybook/react';
import SymptomProgressBar, {SymptomProgressBarProps} from "../../components/SymptomProgressBar";
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
    title: 'Components/Symptom Progress Bar',
    component: SymptomProgressBar,
    argTypes: {
        label: {
            defaultValue: "Max Range of Motion",
            control: {
                type: "text"
            }
        },
        angle: {
            defaultValue: 120,
            control: {
                type: 'range',
                min: 0,
                max: 180,
                step: 1
            },
        },
        goalAngle: {
            defaultValue: 180,
            control: {
                type: 'range',
                min: 0,
                max: 180,
                step: 1
            },
        },
        minAngle: {
            defaultValue: 1, //Storybook bug: https://github.com/storybookjs/storybook/issues/12767
            control: {
                type: 'range',
                min: 0,
                max: 180,
                step: 1
            },
        },
    },
} as Meta;

const Template: Story<SymptomProgressBarProps> = (args) => <SymptomProgressBar {...args}/>;
export const Primary = Template.bind({});
Primary.args = {};

