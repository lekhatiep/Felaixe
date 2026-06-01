export interface SubmissionExam {
    questionIds: number[];
    answers: Record<number,number>;
    startTime: Date;
    endTime: Date;
}