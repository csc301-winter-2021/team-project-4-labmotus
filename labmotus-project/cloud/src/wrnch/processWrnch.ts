// @ts-nocheck
// import sampleData from "./json-assessment_0.json"
// @ts-ignore
// @ts-ignore
import * as THREE from 'three';
import {Vector3} from 'three';
import {Assessment, Joints} from "../../../common/types/types";
import JOINTS from "./processJoints";

export interface WrnchData {
    file_info: {
        duration: number,
        frame_rate: number,
        joint_definitions: {
            hands: string,
            head: string,
            pose2d: string,
            pose3d_ik: string,
            pose3d_raw: string
        }
    }
    frames: {
        frame_time: number,
        height: number,
        width: number,
        persons: {
            id: number,
            pose2d: {
                is_main: boolean,
            },
            pose_3d_raw: {
                positions: number[]
            }
        }[]
    }[]
}

function processRawWrnchData(data: WrnchData) {
    const positions: Vector3[][] = data.frames.filter(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return false;
        return people[0]?.pose_3d_raw != null
    }).map(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return null;
        const raw = people[0].pose_3d_raw.positions;
        const processed: Vector3[] = [];
        for (let i = 0; i < raw.length; i += 3) {
            processed.push(new Vector3(raw[i], raw[i + 1], raw[i + 2]))
        }
        return processed;
    });
    return positions
}

function computeJoints(positions: Vector3[][], joints: Joints[]) {
    const res = {};
    joints.forEach(joint => {
        const reducer = JOINTS[joint].minmax === 'max' ? Math.max : Math.min;
        res[joint] = positions.map(position => JOINTS[joint].computer(position)).reduce(
            (c, n) => n != null ? reducer(c, n) : c,
            JOINTS[joint].min);
    });
    return res;
}

function processWrnchData(data: WrnchData, assessment: Assessment) {
    const positions: Vector3[][] = processRawWrnchData(data);
    const jointData = computeJoints(positions, assessment.joints);
    assessment.stats = Object.values(jointData).map((joint) => ({
        name: JOINTS[joint].movement,
        joint: JOINTS[joint].joint,
        currValue: jointData[joint],
        goalValue: JOINTS[joint].max,
        unit: JOINTS[joint].unit,
        minValue: JOINTS[joint].min
    }))
}

export default processWrnchData;
