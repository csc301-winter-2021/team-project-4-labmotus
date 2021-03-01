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
    username: string
    name: string

    email: string
}

export interface Patients {
    user: User
    phone: string
    birthday: Moment
    height: number // TODO: ASK VICTOR
    weight: number // TODO: ASK VICTOR
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
