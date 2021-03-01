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

export default {
    title: 'Components/IonButtons',
    component: IonButton,
    argTypes: {
        disabled: {
            control: {
                type: "boolean"
            }
        },
        color: {
            defaultValue: "primary",
            control: {
                type: 'select',
                options: ["primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium", "dark"],
            },
        },
        expand: {
            type: {
                required: false,
            },
            defaultValue: undefined,
            control: {
                type: 'select',
                options: [undefined, "block", "full"],
            },
        },
        fill: {
            defaultValue: "solid",
            control: {
                type: 'select',
                options: ["clear", "default", "outline", "solid"],
            },
        },
        mode: {
            defaultValue: "ios",
            control: {
                type: 'select',
                options: ["ios", "md"],
            },
        },
        shape: {
            defaultValue: "round",
            control: {
                type: 'select',
                options: ["round", undefined],
            },
        },
        size: {
            defaultValue: "default",
            control: {
                type: 'select',
                options: ["default", "large", "small"],
            },
        }
    },
} as Meta;

export interface IonButtonProps {
    buttonType: string;
    color?: string;
    disabled?: boolean;
    expand: "block" | "full" | undefined;
    fill: "clear" | "default" | "outline" | "solid" | undefined;
    mode: "ios" | "md";
    shape: "round" | undefined;
    size: "default" | "large" | "small" | undefined;
    label?: string;
}

const Template: Story<IonButtonProps> = (args) => <IonButton {...args}>{args.label}</IonButton>;
export const Primary = Template.bind({});
Primary.args = {
    label: 'Button'
};
