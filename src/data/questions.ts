export type PathType = 'LaserEye' | 'Cataract' | 'DryEye' | 'ContactLens';

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

export const qualifierQuestion: Question = {
  id: 'qualifier',
  question: 'Which of the following best describes your vision situation?',
  options: [
    { label: 'Laser Eye Surgery', value: 'LaserEye' },
    { label: 'Cloudy/Blurred Vision', value: 'Cataract' },
    { label: 'Itchy/Dry Eyes', value: 'DryEye' },
    { label: 'Contact Lens Consultation', value: 'ContactLens' },
  ],
};

export const pathQuestions: Record<PathType, Question[]> = {
  LaserEye: [
    {
      id: 'laser_q2',
      question: 'Do you currently wear glasses or contact lenses?',
      options: [
        { label: 'Yes, glasses', value: 'glasses' },
        { label: 'Yes, contact lenses', value: 'contacts' },
        { label: 'Yes, both', value: 'both' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: 'laser_q3',
      question: 'What is your age range?',
      options: [
        { label: 'Under 21', value: 'under_21' },
        { label: '21-40', value: '21_40' },
        { label: '41-60', value: '41_60' },
        { label: 'Over 60', value: 'over_60' },
      ],
    },
    {
      id: 'laser_q4',
      question: 'Do you have any existing eye health issues?',
      options: [
        { label: 'Dry eyes', value: 'dry_eyes' },
        { label: 'Glaucoma', value: 'glaucoma' },
        { label: 'Cataracts', value: 'cataracts' },
        { label: 'None that I know of', value: 'none' },
      ],
    },
    {
      id: 'laser_q5',
      question: 'Have you had any previous eye surgery?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: 'laser_q6',
      question: 'Would you like to book a free consultation to discuss laser eye surgery?',
      options: [
        { label: 'Yes, definitely', value: 'yes_definitely' },
        { label: 'Yes, but I have more questions', value: 'yes_questions' },
        { label: 'Maybe later', value: 'maybe_later' },
      ],
    },
  ],
  Cataract: [
    {
      id: 'cataract_q2',
      question: 'Are you experiencing cloudy or blurred vision?',
      options: [
        { label: 'Yes, frequently', value: 'frequently' },
        { label: 'Sometimes', value: 'sometimes' },
        { label: 'Rarely', value: 'rarely' },
        { label: 'Not sure', value: 'not_sure' },
      ],
    },
    {
      id: 'cataract_q3',
      question: 'Have you been diagnosed with cataracts?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Not yet, but I suspect I have them', value: 'suspect' },
      ],
    },
    {
      id: 'cataract_q4',
      question: 'Do you currently use reading glasses?',
      options: [
        { label: 'Yes, all the time', value: 'always' },
        { label: 'Yes, occasionally', value: 'occasionally' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: 'cataract_q5',
      question: 'Are you interested in learning about lens replacement options?',
      options: [
        { label: 'Yes, very interested', value: 'very_interested' },
        { label: 'Somewhat interested', value: 'somewhat' },
        { label: 'Just exploring options', value: 'exploring' },
      ],
    },
    {
      id: 'cataract_q6',
      question: 'Would you like to book a consultation to discuss your vision?',
      options: [
        { label: 'Yes, as soon as possible', value: 'yes_asap' },
        { label: 'Yes, but not urgent', value: 'yes_not_urgent' },
        { label: 'I need more information first', value: 'need_info' },
      ],
    },
  ],
  DryEye: [
    {
      id: 'dry_q2',
      question: 'How often do your eyes feel irritated or dry?',
      options: [
        { label: 'Daily', value: 'daily' },
        { label: 'A few times a week', value: 'weekly' },
        { label: 'Occasionally', value: 'occasionally' },
        { label: 'Rarely', value: 'rarely' },
      ],
    },
    {
      id: 'dry_q3',
      question: 'Do you currently use eye drops?',
      options: [
        { label: 'Yes, daily', value: 'yes_daily' },
        { label: 'Yes, occasionally', value: 'yes_occasionally' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: 'dry_q4',
      question: 'Do you spend long hours working on a computer or digital device?',
      options: [
        { label: 'Yes, more than 6 hours a day', value: 'heavy_use' },
        { label: 'Yes, 3-6 hours a day', value: 'moderate_use' },
        { label: 'Less than 3 hours a day', value: 'light_use' },
      ],
    },
    {
      id: 'dry_q5',
      question: 'Do you have any known allergies that affect your eyes?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Not sure', value: 'not_sure' },
      ],
    },
    {
      id: 'dry_q6',
      question: 'Would you like professional advice on treating dry eyes?',
      options: [
        { label: 'Yes, I need help', value: 'yes_need_help' },
        { label: 'Yes, interested in options', value: 'yes_interested' },
        { label: 'Just gathering information', value: 'just_info' },
      ],
    },
  ],
  ContactLens: [
    {
      id: 'contact_q2',
      question: 'Are you currently wearing contact lenses?',
      options: [
        { label: 'Yes, regularly', value: 'yes_regularly' },
        { label: 'Yes, occasionally', value: 'yes_occasionally' },
        { label: 'No, but I used to', value: 'used_to' },
        { label: 'No, never tried them', value: 'never' },
      ],
    },
    {
      id: 'contact_q3',
      question: 'Do you find your current lenses uncomfortable?',
      options: [
        { label: 'Yes, often', value: 'yes_often' },
        { label: 'Sometimes', value: 'sometimes' },
        { label: 'No', value: 'no' },
        { label: 'Not applicable', value: 'na' },
      ],
    },
    {
      id: 'contact_q4',
      question: 'Are you interested in exploring new contact lens options?',
      options: [
        { label: 'Yes, definitely', value: 'yes_definitely' },
        { label: 'Maybe', value: 'maybe' },
        { label: 'Just curious', value: 'curious' },
      ],
    },
    {
      id: 'contact_q5',
      question: 'Do you experience dryness when wearing contact lenses?',
      options: [
        { label: 'Yes, frequently', value: 'frequently' },
        { label: 'Sometimes', value: 'sometimes' },
        { label: 'Rarely', value: 'rarely' },
        { label: 'Never/Not applicable', value: 'never_na' },
      ],
    },
    {
      id: 'contact_q6',
      question: 'Would you like to book a contact lens fitting consultation?',
      options: [
        { label: 'Yes, please', value: 'yes_please' },
        { label: 'Yes, but I have questions first', value: 'yes_questions' },
        { label: 'Not at this time', value: 'not_now' },
      ],
    },
  ],
};
