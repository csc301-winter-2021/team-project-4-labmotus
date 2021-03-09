import {useState} from 'react';
import {IonDatetime} from '@ionic/react';
import moment, {Moment} from "moment";

export interface DateDisplayProps {
    date: Moment;
    changeDay?: (newDay: Moment) => void;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({date, changeDay}) => {
    const [selectedDate, setSelectedDate] = useState<string>(date.format("YYYY-MM-DD"));
    return (
        <IonDatetime displayFormat="DDD" pickerFormat="MMMM DD YYYY"
                     dayShortNames={["Select date", "Select date", "Select date", "Select date", "Select date", "Select date", "Select date"]}
            // dayShortNames is a really stupid way to show the "Select date" title, by renaming each day of the week as "Select date"
            // and making "DDD" the format of the title

                     value={selectedDate}
                     onIonChange={e => {
                         console.log("e.detail.value: " + e.detail.value!);
                         setSelectedDate(e.detail.value!);
                         console.log("e.detail.value: " + e.detail.value!);
                         changeDay(moment(e.detail.value!, 'YYYY-MM-DD'));
                     }
                     }
                     onIonFocus={() => {
                         setSelectedDate(date.format('YYYY-MM-DD'))
                     }
                     }
        />
    )
};
