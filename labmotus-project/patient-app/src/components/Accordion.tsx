import React, {FunctionComponent, useRef, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
// @ts-ignore
import {chevronDown} from "ionicons/icons";
import {IonCard, IonCardContent, IonCardHeader, IonIcon} from "@ionic/react";
// @ts-ignore
import ResizeObserver from 'resize-observer-polyfill';


export interface AccordionProps {
    label: string;
    labelFont?: string;
    expanded?: boolean;
    initialExpanded?: boolean;
    shadow?: boolean;
    onClick?: (expanded: boolean) => void;
}

const Accordion: FunctionComponent<AccordionProps> = ({
                                                          label,
                                                          labelFont = "primary",
                                                          expanded: expandedParent,
                                                          initialExpanded = true,
                                                          shadow = true,
                                                          onClick: onClickCallback,
                                                          children
                                                      }) => {
    const theme = React.useContext(ThemeContext);
    const [expandedState, setExpanded] = useState(initialExpanded);
    const expanded = expandedParent === undefined ? expandedState : expandedParent;
    const [height, setHeight] = useState(undefined);
    const bodyRef = useRef();

    function onClick() {
        if (onClickCallback !== undefined)
            onClickCallback(!expanded);
        setExpanded(!expanded);
    }

    function update(ref: any) {
        bodyRef.current = ref;
        if (ref != null)
            new ResizeObserver((e: any) => {
                setHeight(e[0].borderBoxSize[0].blockSize);
            }).observe(ref);
    }

    return (<AccordionDiv className="accordion">
        <Card shadow={shadow}>
            <HeaderDiv expanded={expanded} onClick={onClick}>
                <IonIcon icon={chevronDown}/>
                <LabelSpan labelFont={labelFont} {...theme}>
                    {label}
                </LabelSpan>
            </HeaderDiv>
            <BodyDiv expanded={expanded} height={height}>
                <IonCardContent ref={(ref) => update(ref)}>
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

interface CardProps {
    shadow: boolean;
}

const Card = styled(IonCard)`
    margin: 0px;
    ${({shadow}: CardProps) => (
    !shadow && `
        box-shadow: none;
        `
)}
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
    font-size: ${(props: Theme & { labelFont: string }) => {
    // @ts-ignore
    return props[`${props.labelFont}FontSize`]
}
};
    font-family: ${(props: Theme & { labelFont: string }) => {
    // @ts-ignore
    return props[`${props.labelFont}FontFamily`]
}};
    font-weight: bold;
    color: ${(props: Theme) => props.colors.contrast};
`;

export default Accordion;
