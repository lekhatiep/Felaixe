export interface ResultExam {
    Score: number;
    IsPassed: boolean;
    WrongQuestionIds: number[];
    ExamDate: Date
}