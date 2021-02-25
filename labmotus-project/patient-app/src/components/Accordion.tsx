import React, {FunctionComponent, useRef, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
// @ts-ignore
import {chevronDown} from "ionicons/icons";
import {IonCard, IonCardContent, IonCardHeader, IonIcon} from "@ionic/react";

export interface AccordionProps {
    label: string;
    expanded?: boolean;
    onClick?: (expanded: boolean) => void;
}

const Accordion: FunctionComponent<AccordionProps> = ({
                                                          label,
                                                          expanded: expandedParent,
                                                          onClick: onClickCallback,
                                                          children
                                                      }) => {
    const theme = React.useContext(ThemeContext);
    const [expandedState, setExpanded] = useState(false);
    const expanded = expandedParent === undefined ? expandedState : expandedParent;
    const bodyRef = useRef();

    function onClick() {
        if (onClickCallback !== undefined)
            onClickCallback(!expanded);
        setExpanded(!expanded);
    }

    return (<AccordionDiv className="accordion">
        <Card>
            <HeaderDiv expanded={expanded} onClick={onClick}>
                <IonIcon icon={chevronDown}/>
                <LabelSpan {...theme}>
                    {label}
                </LabelSpan>
            </HeaderDiv>
            <BodyDiv expanded={expanded} height={bodyRef.current?.clientHeight}>
                <IonCardContent ref={bodyRef}>
                    {children}
                </IonCardContent>
            </BodyDiv>
        </Card>
    </AccordionDiv>)
};

const AccordionDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const Card = styled(IonCard)`

`;

interface ExpandedProps {
    expanded: boolean;
    height?: number;
}

const HeaderDiv = styled(IonCardHeader)`
    align-items: center;
    display: flex;
    padding: 10px;
    cursor: pointer;
    user-select: none;
    ion-icon {
        transform: rotate(-${({expanded}: ExpandedProps) => expanded ? "0" : "90"}deg);
        transition: transform 0.25s;
    }
`;

const BodyDiv = styled.div`
    transition: max-height 0.5s ease;
    overflow: hidden;
    max-height: ${({expanded, height}: ExpandedProps) => (
    expanded ? (height != null ? `${height}px` : "1000px") : "0"
)};
`;

const LabelSpan = styled.span`
    margin-left: 1.5%;
    font-size: ${(props: Theme) => props.primaryFontSize};
    font-family: ${(props: Theme) => props.primaryFontFamily};
    font-weight: bold;
    color: ${(props: Theme) => props.colors.contrast};
`;

export default Accordion;
