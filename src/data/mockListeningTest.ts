import { IELTSExam } from '@/types/ielts';

export const mockListeningExam: IELTSExam = {
  id: 'cambridge-18-academic-listening-test-1',
  title: 'Cambridge IELTS 18 - Listening Test 1',
  module: 'listening',
  category: 'Academic',
  durationMinutes: 30,
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Transport Survey',
      instructions: 'Answer Questions 1-10. Write ONE WORD AND/OR A NUMBER for each answer.',
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg',
      audioTitle: 'Official Audio Track - Part 1 (Transport Survey)',
      questions: [
        {
          id: 'lq1',
          number: 1,
          part: 1,
          type: 'gap_fill',
          prompt: 'Name of applicant: Louisa ________',
          gapLabel: 'Question 1',
          correctAnswer: 'Graham',
          acceptableAnswers: ['Graham', 'graham'],
          explanation: 'The speaker spells out her surname: G-R-A-H-A-M.',
          evidenceSentence: 'My last name is Graham, that is G-R-A-H-A-M.'
        },
        {
          id: 'lq2',
          number: 2,
          part: 1,
          type: 'gap_fill',
          prompt: 'Current occupation: ________ assistant',
          gapLabel: 'Question 2',
          correctAnswer: 'library',
          acceptableAnswers: ['library'],
          explanation: 'The woman states she is currently working as a library assistant.',
          evidenceSentence: 'I work part-time as a library assistant at the university.'
        },
        {
          id: 'lq3',
          number: 3,
          part: 1,
          type: 'gap_fill',
          prompt: 'Travels to town by ________ on weekdays',
          gapLabel: 'Question 3',
          correctAnswer: 'bicycle',
          acceptableAnswers: ['bicycle', 'bike'],
          explanation: 'She says she rides her bicycle into town every morning.',
          evidenceSentence: 'Usually I ride my bicycle unless it is heavily raining.'
        },
        {
          id: 'lq4',
          number: 4,
          part: 1,
          type: 'gap_fill',
          prompt: 'Main complaint: lack of safe ________ along the river',
          gapLabel: 'Question 4',
          correctAnswer: 'lighting',
          acceptableAnswers: ['lighting', 'lights'],
          explanation: 'She remarks that lighting by the riverside path is inadequate.',
          evidenceSentence: 'The path along the river has very poor lighting at night.'
        },
        {
          id: 'lq5',
          number: 5,
          part: 1,
          type: 'gap_fill',
          prompt: 'Price of monthly student bus pass: £________',
          gapLabel: 'Question 5',
          correctAnswer: '45',
          acceptableAnswers: ['45', 'forty five'],
          explanation: 'The interviewer confirms the discounted monthly pass is 45 pounds.',
          evidenceSentence: 'A standard pass is sixty pounds, but for students it is forty-five pounds.'
        },
        {
          id: 'lq6',
          number: 6,
          part: 1,
          type: 'gap_fill',
          prompt: 'Recommended bus route number: ________',
          gapLabel: 'Question 6',
          correctAnswer: '14B',
          acceptableAnswers: ['14B', '14b'],
          explanation: 'He recommends taking route 14B because it avoids the city center congestion.',
          evidenceSentence: 'Route 14B is faster during peak commuting hours.'
        },
        {
          id: 'lq7',
          number: 7,
          part: 1,
          type: 'gap_fill',
          prompt: 'Frequent delays caused by ongoing road ________',
          gapLabel: 'Question 7',
          correctAnswer: 'repairs',
          acceptableAnswers: ['repairs', 'works', 'construction'],
          explanation: 'Road repairs on High Street have created long tailbacks.',
          evidenceSentence: 'There are major road repairs happening on the high bridge.'
        },
        {
          id: 'lq8',
          number: 8,
          part: 1,
          type: 'gap_fill',
          prompt: 'Survey feedback form code: ________-77',
          gapLabel: 'Question 8',
          correctAnswer: 'TR',
          acceptableAnswers: ['TR', 'tr'],
          explanation: 'The code on top of the document is TR-77.',
          evidenceSentence: 'Please note code TR-77 at the top of your receipt.'
        },
        {
          id: 'lq9',
          number: 9,
          part: 1,
          type: 'gap_fill',
          prompt: 'Preferred communication method: ________ message',
          gapLabel: 'Question 9',
          correctAnswer: 'text',
          acceptableAnswers: ['text', 'sms'],
          explanation: 'She indicates she prefers text messages over emails.',
          evidenceSentence: 'A text message to my mobile is definitely best.'
        },
        {
          id: 'lq10',
          number: 10,
          part: 1,
          type: 'gap_fill',
          prompt: 'Follow-up interview scheduled in ________',
          gapLabel: 'Question 10',
          correctAnswer: 'November',
          acceptableAnswers: ['November', 'nov'],
          explanation: 'The follow-up consultation will be held in November.',
          evidenceSentence: 'We will invite participants back for a focus group in November.'
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Red Rock Wildlife Sanctuary',
      instructions: 'Answer Questions 11-20. Choose the correct letter, A, B, or C.',
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/rainforest_birds.ogg',
      audioTitle: 'Official Audio Track - Part 2 (Sanctuary Tour)',
      questions: [
        {
          id: 'lq11',
          number: 11,
          part: 2,
          type: 'mcq_single',
          prompt: 'The Red Rock Wildlife Sanctuary was originally founded to:',
          options: [
            { label: 'A', text: 'Breed endangered birds for international zoos' },
            { label: 'B', text: 'Rehabilitate injured local wildlife' },
            { label: 'C', text: 'Provide recreation facilities for school camps' }
          ],
          correctAnswer: 'B',
          explanation: 'The guide explains the sanctuary started as a small hospital for wounded indigenous fauna.',
          evidenceSentence: 'Originally founded in 1984, our primary mission was nursing injured native creatures back to health.'
        },
        {
          id: 'lq12',
          number: 12,
          part: 2,
          type: 'mcq_single',
          prompt: 'What major development occurred at the sanctuary last year?',
          options: [
            { label: 'A', text: 'A nocturnal house was opened to visitors' },
            { label: 'B', text: 'The entrance fees were reduced for senior citizens' },
            { label: 'C', text: 'A solar-powered electric tram was installed' }
          ],
          correctAnswer: 'A',
          explanation: 'The guide mentions last year saw the completion of the new nocturnal mammal observatory.',
          evidenceSentence: 'Last spring, we were thrilled to open the climate-controlled nocturnal house.'
        },
        {
          id: 'lq13',
          number: 13,
          part: 2,
          type: 'mcq_single',
          prompt: 'Visitors are reminded that in the walk-through aviary they must:',
          options: [
            { label: 'A', text: 'Keep their cameras inside protective bags' },
            { label: 'B', text: 'Remain strictly on the wooden boardwalk' },
            { label: 'C', text: 'Wear protective headgear at all times' }
          ],
          correctAnswer: 'B',
          explanation: 'Visitors must strictly stay on the elevated timber walkway to avoid trampling sensitive ground nests.',
          evidenceSentence: 'You must strictly remain on the wooden boardwalk to protect ground nesting sites.'
        }
      ]
    }
  ]
};
