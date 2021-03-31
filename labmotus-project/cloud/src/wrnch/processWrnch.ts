// import sampleData from "./json-assessment_0.json"
// @ts-ignore
// @ts-ignore
import * as THREE from 'three';
import {Vector3} from 'three';
import {Joints, PoseData, Stats} from "../../../common/types/types";
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

function processRawWrnchData(data: WrnchData): PoseData {
    const poseData: PoseData = data.frames.filter(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return false;
        return people[0]?.pose_3d_raw != null
    }).map(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return null;
        const raw = people[0].pose_3d_raw.positions;
        const processed: number[][] = [];
        for (let i = 0; i < raw.length; i += 3) {
            processed.push([raw[i], raw[i + 1], raw[i + 2]])
        }
        return {
            frame_time: frame.frame_time,
            positions: processed
        };
    });
    return poseData;
}

function computeJoints(poseData: PoseData, joints: Joints[]): { joint: Joints, value: number }[] {
    const ROUND_FACTOR = 100;
    const res = [];
    joints.forEach(joint => {
        let values = poseData
            .map(frame => JOINTS[joint].computer(frame.positions.map(p => new Vector3(p[0], p[1], p[2]))))
            .map(value => Math.round(value * ROUND_FACTOR) / ROUND_FACTOR);
        const reducer = JOINTS[joint].minmax === 'max' ? Math.max : Math.min;
        res.push({
            joint,
            value: values.reduce((c, n) => n != null ? reducer(c, n) : c, values[0])
        });
    });
    return res;
}

function processWrnchData(data: WrnchData, joints: Joints[]): { poseData: PoseData, stats: Stats[] } {
    const poseData: PoseData = processRawWrnchData(data);
    const jointData = computeJoints(poseData, joints);
    return {
        poseData,
        stats: jointData.map(data => ({
            name: JOINTS[data.joint].movement,
            joint: JOINTS[data.joint].joint,
            currValue: data.value,
            goalValue: JOINTS[data.joint].max,
            unit: JOINTS[data.joint].unit,
            minValue: JOINTS[data.joint].min
        }))
    };
}

export default processWrnchData;
