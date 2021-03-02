import React from 'react';
import {Meta, Story} from '@storybook/react';
import NavigationBar, {NavigationBarProps} from "../../components/NavigationBar";
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

import {MemoryRouter} from "react-router";
import {home, settings, videocam} from "ionicons/icons";

export default {
    title: 'Components/Navigation Bar',
    component: NavigationBar,
    argTypes: {},
} as Meta;

const Template: Story<NavigationBarProps> = (args) => (
    <MemoryRouter>
        <NavigationBar entries={[
            {
                icon: home,
                name: "Home",
                navigation: "/home"
            },
            {
                icon: videocam,
                name: "Record",
                navigation: "/record"
            },
            {
                icon: settings,
                name: "Settings",
                navigation: "/settings"
            }
        ]} {...args}/>
    </MemoryRouter>
);
export const Primary = Template.bind({});
Primary.args = {};

