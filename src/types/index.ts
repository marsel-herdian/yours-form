export interface Question {
  id: number;
  form_id: number;
  name: string;
  choice_type: string;
  choices: string | null;
  is_required: number;
}

export interface FormDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  limit_one_response: boolean;
  creator_id: number;
  allowed_domains: string[];
  questions: Question[];
}

export interface FormData {
  id: string;
  name: string;
  slug: string;
  description: string;
  limit_one_response: boolean;
}

export interface QuestionFormInput {
  name: string;
  choice_type: string;
  choices?: string;
  is_required?: boolean;
}

export interface AddQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: QuestionFormInput) => void;
}

export interface ResponseData {
  date: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  answers: {
    [questionLabel: string]: string;
  };
}

