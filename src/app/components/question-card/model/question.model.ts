export interface Question extends QuestionResponseModel {
    chapterId: number;
    id: number;
    questionNumber: number;
    imgUrl?: string;
    isCritical: boolean; 
    question: string;
    index: number;
    content: string;
    explanation?: string;
    answers?: Answer[];
    state?: 'default' | 'active' | 'correct' | 'incorrect'
    isAnswered: boolean;
    quizState?: QuizState
}

export interface Answer {
    id: number;
    questionID: number;
    content: string;
    isCorrect: boolean;
    label: string;
    text: string;
}


export interface QuizState {
    questionNumber: number;
    answerId: number;
    isCorrect: boolean;
}
export interface QuestionResponseModel {
    
}

export interface CurrentQuestionState {
    index: number,
    question: Question
}