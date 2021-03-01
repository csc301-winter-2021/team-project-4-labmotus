import React from 'react';
// @ts-ignore
import styled from 'styled-components';
import {Meta, Story} from '@storybook/react';
import Accordion, {AccordionProps} from "../../components/Accordion";
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
    title: 'Components/Accordion',
    component: Accordion,
    argTypes: {
        label: {
            defaultValue: "Accordion",
            control: {
                type: "text"
            }
        },
        content: {
            defaultValue: "Accordion Content",
            control: {
                type: "text"
            }
        },
        expanded: {
            control: {
                type: null
            }
        },
        onClick: {
            action: 'clicked'
        }
    },
} as Meta;

export interface AccordionControls extends AccordionProps {
    content: string;
}

const Template: Story<AccordionControls> = (args) =>
    <Container>
        <Accordion {...args}>
            {args.content.split("\n").map((value => (
                <>{value}<br/></>
            )))}
        </Accordion>
    </Container>;
export const Primary = Template.bind({});
Primary.args = {};

const Container = styled.div`
    .accordion {
    }
`;
