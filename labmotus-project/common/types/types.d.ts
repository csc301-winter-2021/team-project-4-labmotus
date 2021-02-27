export interface Assessment {
    id: string
    patientId: string
    date: Date
    videoUrl: string
    stats: Array<Stats>
}

export interface User {
    id: string
    firebaseId: string
    username: string
    name: string

    email: string
}

export interface Patient {
    user: User
    phone: string
    birthday: Date
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
}