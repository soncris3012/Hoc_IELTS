export interface WritingTask {
  taskNumber: 1 | 2;
  title: string;
  type: 'academic_task_1' | 'task_2_essay';
  timeRecommendedMinutes: number;
  minWords: number;
  prompt: string;
  chartDescription?: string;
  sampleBand9Answer: string;
}

export const mockWritingExam = {
  id: 'cambridge-18-writing-test-1',
  title: 'Cambridge IELTS 18 - Academic Writing Test 1',
  module: 'writing' as const,
  durationMinutes: 60,
  tasks: [
    {
      taskNumber: 1,
      title: 'Task 1: Renewable Energy Generation in Four Countries (2010 - 2020)',
      type: 'academic_task_1',
      timeRecommendedMinutes: 20,
      minWords: 150,
      prompt: `The chart below shows the percentage of electricity generated from renewable sources in four European countries between 2010 and 2020.
      
Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
Write at least 150 words.`,
      chartDescription: `Data summary:
- Germany: 2010 (17%), 2015 (30%), 2020 (45%)
- United Kingdom: 2010 (7%), 2015 (25%), 2020 (42%)
- Spain: 2010 (32%), 2015 (37%), 2020 (44%)
- Norway: 2010 (96%), 2015 (97%), 2020 (98%)`,
      sampleBand9Answer: `The line graph delineates the proportion of electricity produced from renewable energy sources across four European nations—Germany, the United Kingdom, Spain, and Norway—over a ten-year timeframe spanning from 2010 to 2020.

Overall, it is unequivocally apparent that all four countries experienced an upward trajectory in green energy production, although Norway maintained an overwhelming dominance throughout the entire decade. Furthermore, the United Kingdom recorded the most substantial growth rate among all observed nations.

In 2010, Norway generated nearly all of its electricity from renewable origins at 96%, a figures that gradually rose to a peak of 98% by 2020. In stark contrast, the UK began the period with the lowest share, registering a modest 7%. However, robust investment spurred a dramatic rise in the UK's output, surging to 25% in 2015 before culminating at 42% in 2020, representing a six-fold multiplication.

Concurrently, Germany exhibited a consistent and steady expansion, advancing from 17% in 2010 to 30% at the midpoint, and ultimately reaching 45% in 2020. Spain, which initiated the decade in second position at 32%, experienced a more moderate progression, closing the period at 44%, marginally behind Germany.`
    },
    {
      taskNumber: 2,
      title: 'Task 2: Artificial Intelligence and Human Employment',
      type: 'task_2_essay',
      timeRecommendedMinutes: 40,
      minWords: 250,
      prompt: `Some people believe that the rapid advance of artificial intelligence will lead to massive unemployment and social inequality. Others argue that AI will generate new industries and elevate human quality of life.

Discuss both views and give your own opinion.
Write at least 250 words.`,
      sampleBand9Answer: `The exponential acceleration of artificial intelligence (AI) and automated systems has ignited an impassioned debate regarding its socio-economic consequences. While pessimists foresee widespread technological unemployment and exacerbated wealth disparity, optimists contend that AI will spark novel industries and foster unprecedented prosperity. In my estimation, although short-term workforce disruption is inevitable, thoughtful regulatory frameworks and proactive re-skilling initiatives will allow AI to fundamentally augment, rather than extinguish, human livelihood.

On the one hand, critics voice legitimate anxieties concerning the unprecedented velocity of cognitive automation. Unlike the Industrial Revolution, which primarily substituted manual muscle with mechanization, generative AI models and neural networks now challenge knowledge-based professions—including paralegals, radiologists, software programmers, and financial analysts. If legacy job functions are displaced faster than redundant workers can adapt, the transition risks generating chronic structural unemployment. Furthermore, because capital gains from proprietary algorithmic platforms disproportionately enrich tech conglomerates, unconstrained automation could amplify societal wealth polarization.

Conversely, proponents persuasively maintain that technological revolutions historically serve as catalysts for economic diversification. By delegating tedious, repetitive data synthesis to computational algorithms, human professionals can concentrate on high-order synthesis, empathetic communication, and creative strategy. Furthermore, the expansion of the AI ecosystem is currently birthing previously inconceivable industries, from prompt engineering and quantum ethical auditing to customized genomic diagnostics. Historical precedent reveals that the advent of personal computers eliminated typists yet created millions of digital architects, designers, and network engineers.

In conclusion, while the apprehension surrounding algorithmic displacement is justified, viewing AI purely as an employment killer overlooks the transformative historical arc of technological maturation. By implementing robust social safety nets and modernizing educational curricula around interdisciplinary competencies, societies can harness AI to cultivate elevated standards of living.`
    }
  ]
};
