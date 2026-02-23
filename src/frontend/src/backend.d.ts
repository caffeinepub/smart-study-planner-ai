import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudySession {
    startTime: Time;
    subject: string;
    endTime: Time;
    completed: boolean;
}
export type Time = bigint;
export interface backendInterface {
    addSession(subject: string, startTime: Time, endTime: Time): Promise<void>;
    calculateCompletionRate(): Promise<bigint>;
    completeSession(subject: string): Promise<void>;
    getAllSessions(): Promise<Array<StudySession>>;
}
