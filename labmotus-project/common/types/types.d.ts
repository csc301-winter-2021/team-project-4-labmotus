import {Moment} from "moment";

export interface Assessment {
    id: string
    patientId: string
    date: Moment
    videoUrl?: string
    stats: Array<Stats>
}

export interface User {
    id: string
    firebaseId: string
    name: string
    email: string
}

export interface Patient {
    user: User
    phone: string
    birthday: Moment
}

export interface Clinician {
    user: User
    clinic: string
    patientIDs: Array<string> // UserIds
}

export interface Stats {
    name: string
    joint: string
    currValue: number
    goalValue: number
    minValue?: number
}
