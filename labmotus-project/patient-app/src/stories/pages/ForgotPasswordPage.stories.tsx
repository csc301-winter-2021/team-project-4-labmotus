import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import ForgotPasswordPage, {ForgotPasswordPageProps} from '../../../../common/ui/pages/ForgotPasswordPage';
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
    title: 'Pages/Forgot Password Page',
    component: ForgotPasswordPage,
} as Meta;

const Template: Story<ForgotPasswordPageProps> = (args) => <ForgotPasswordPage {...args} />;

export const Default = Template.bind({});
Default.args = {};
