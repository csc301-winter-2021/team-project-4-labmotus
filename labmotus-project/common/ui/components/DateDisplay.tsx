import React, {FunctionComponent, useEffect, useState} from 'react';
import {IonDatetime} from "@ionic/react";
import moment, {Moment} from "moment";

export interface DateDisplayProps {
    date: Moment;
    displayFormat: string;
    dayShortNames?: string[];
    changeDay?: (newDay: Moment) => void;
}

export const DateDisplay: FunctionComponent<DateDisplayProps> = ({date, displayFormat, dayShortNames, changeDay}) => {
    const [selectedDate, setSelectedDate] = useState<string>(date.format("YYYY-MM-DD"));
    useEffect(() => {
        setSelectedDate(date.format("YYYY-MM-DD"))
    }, [date]);
    return (
        <IonDatetime
            displayFormat={displayFormat}
            pickerFormat="MMMM DD YYYY"
            dayShortNames={dayShortNames}

            value={selectedDate}
            onIonChange={(e) => {
                setSelectedDate(e.detail.value!);
                changeDay(moment(e.detail.value!, "YYYY-MM-DD"));
            }}
            onIonFocus={() => {
                setSelectedDate(date.format("YYYY-MM-DD"));
            }}
        />
    );
};
