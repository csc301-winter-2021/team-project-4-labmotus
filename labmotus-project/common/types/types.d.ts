export interface Assessment {
    id: string
    patientId: string
    date: Date
    videoUrl: string
    poseData?: any // TODO: Create type for pose data
    stats?: Array<Stats>
}

export interface User {
    id: string
    firebaseId?: string
    username: string
    name: string
    email: string
}

export interface Patient {
    user: User
    patientCode?: string
    phone: string
    birthday: Date
}

export interface Clinician {
    user: User
    clinic: string
    patientIDs?: Array<string> // UserIds
}

export interface Stats {
    name: string
    joint: string
    currValue: number
    goalValue: number
}

export interface Response<T> {
    success: boolean
    error?: string
    body?: T
}