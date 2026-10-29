export interface ResultExam {
    id: number;
    score: number;
    isPassed: boolean;
    wrongQuestionIds: number[];
    questionIds: number[];
    correctQuestionIds: number[];
    examDate: Date;
    durationSeconds: number;
    answers: Record<number,number>;
}