import { IELTSExam } from '@/types/ielts';

export const youpassLegoExam: IELTSExam = {
  id: 'youpass-simulation-q4-the-lego-brick',
  title: '[Simulation Q4] The Lego brick (YouPass Authentic)',
  module: 'reading',
  category: 'Academic',
  durationMinutes: 20,
  parts: [
    {
      partNumber: 1,
      title: 'Reading Passage 2',
      subtitle: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      instructions: 'Read the text below and answer Questions 14–26.',
      passage: {
        id: 'passage-lego',
        title: 'The Lego brick',
        paragraphs: [
          {
            id: 'para-a',
            label: 'A',
            text: "The company that manufactures Lego bricks began in 1932 in Billund, Denmark, where a carpenter, Ole Kirk Christiansen, believed that even in difficult economic times families would still buy toys. His business, named after the Danish words leg godt ('play well'), originally produced wooden toys, but after the Second World War it invested in a machine for moulding plastic. Its first plastic bricks, though, had a weakness that would take almost a decade to overcome. These bricks were hollow, so they held together only weakly, and children's models could collapse if moved. After years of experiments, the company added tubes inside every brick to grip the brick underneath, giving the bricks what the company calls 'clutch power'. This 1958 design has hardly changed, and a Lego brick manufactured today will still fit a brick made more than 60 years ago."
          },
          {
            id: 'para-b',
            label: 'B',
            text: "But the brick's days at the top of the toy box were numbered. As the century approached its end, children began to abandon traditional toys at an ever younger age in favour of video games and electronic entertainment. Rivals, meanwhile, made their products in low-cost countries, and some imitations of the brick were so poorly made that they could break in a child's hand. On the advice of consultants, who considered the brick obsolete, the company moved into areas such as theme parks, clothing and video games, and its 2003 accounts showed the biggest loss in the company's history."
          },
          {
            id: 'para-c',
            label: 'C',
            text: "With the business close to collapse and indebted, the family that owned the company turned to a former management consultant. Jørgen Vig Knudstorp, the new chief executive, began by selling off activities unconnected with the brick. Its Legoland parks went to Merlin Entertainments, and the company cut the number of different pieces it produced by half, to just 6,500. He also encouraged communication with adult fans, which the company had once regarded as forbidden. Even so, many observers at the time doubted whether Lego could survive as an independent business. The leaner company soon proved them wrong. Within a few years its profits had quadrupled, and for a time they increased faster than those of Apple. In 2015 it overtook Ferrari to become the world's most powerful brand. Its recovery has been called the greatest turnaround in corporate history, and a book about it, Brick by Brick, has become a standard text in business education."
          },
          {
            id: 'para-d',
            label: 'D',
            text: "Today fans can submit designs for new sets to the company's Lego Ideas website, but the company will only examine a design once at least 10,000 other fans have given it their online support. Lego Ideas began as a crowdsourcing experiment in Japan, where the support of 1,000 fans was enough, and since its relaunch even teenagers have been allowed to participate. Designs that gain enough support are examined by a review board, a process that can take several months, and the few designs that are chosen become official Lego sets, earning the fans who originally created them 1 per cent of the net sales. The website had proved extremely popular even before its relaunch, attracting more than half a million members. A set called Women of NASA later became Amazon's best-selling toy on its very first day of release."
          },
          {
            id: 'para-e',
            label: 'E',
            text: "Not every new project succeeded, and the players of Lego Universe, an online game only a year old, received unwelcome news. Although more than 2.3 million players registered, too few of them paid the monthly subscription, so the company shut the game down a few months later. Scott Brown, one of the game's creators, recalled seeing children cry as it shut down."
          },
          {
            id: 'para-f',
            label: 'F',
            text: "In 2020 the company faced a different challenge when the coronavirus forced toy retailers around the world to close their doors temporarily. Its factories in China and Mexico also suspended production for a time, which made transporting its products around the world more expensive. Yet more consumers of all ages turned to building, and the number of visits to the company's website doubled. That year the company also introduced sets designed especially for adults, and a new range combining bricks with digital play became one of its most successful launches. Over the year as a whole, the company's revenue rose by 13 per cent, and its operating profit grew even faster."
          },
          {
            id: 'para-g',
            label: 'G',
            text: "The brick itself has proved much harder to reinvent. Most Lego bricks are still manufactured from ABS, an oil-based plastic, and the production of each kilogram of this plastic requires two kilograms of petroleum. In 2021 the company revealed prototype bricks made from discarded drinks bottles. On average, it calculated, a single one-litre bottle would provide enough plastic to make ten of them. Two years later, though, it abandoned this plan, having found that converting its factories to the new plastic would actually increase carbon emissions. More than 600 materials have been tested, but its chief executive admits that finding a perfect substitute has 'just not been possible'. Yet the company argues that durability is itself part of the solution. The safety standards that every Lego brick has to meet are extremely strict, and the bricks are designed to be durable enough to be handed down through generations. Meanwhile, families are being encouraged to pass on bricks they no longer need, and the company's take-back scheme has already given millions of these bricks to children in need. Since a brick manufactured today will still fit a brick made decades ago, it may turn out that the most sustainable Lego brick is one that already exists."
          }
        ]
      },
      questions: [
        {
          id: 'q14',
          number: 14,
          part: 1,
          type: 'matching_headings',
          prompt: 'Paragraph A',
          correctAnswer: 'An early design fault is put right',
          explanation: "Paragraph A explains that the first plastic bricks were hollow and held together weakly. After years of experiments, the company added tubes inside to provide 'clutch power'.",
          evidenceSentence: 'These bricks were hollow, so they held together only weakly... After years of experiments, the company added tubes inside every brick to grip the brick underneath.',
          evidenceSentenceId: 'para-a',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'early design fault', passageKeyword: 'first plastic bricks had a weakness... hollow, held together only weakly' },
            { questionKeyword: 'put right', passageKeyword: 'added tubes inside every brick to grip... clutch power' }
          ]
        },
        {
          id: 'q15',
          number: 15,
          part: 1,
          type: 'matching_headings',
          prompt: 'Paragraph B',
          correctAnswer: 'Changing habits and new competitors cause a decline',
          explanation: 'Paragraph B describes how children began abandoning traditional toys for video games (changing habits) and rivals made low-cost imitations (competitors), leading to the biggest loss in history.',
          evidenceSentence: 'children began to abandon traditional toys at an ever younger age in favour of video games... Rivals, meanwhile, made their products in low-cost countries...',
          evidenceSentenceId: 'para-b',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'changing habits', passageKeyword: 'abandon traditional toys in favour of video games' },
            { questionKeyword: 'new competitors', passageKeyword: 'rivals made products in low-cost countries' },
            { questionKeyword: 'decline', passageKeyword: 'biggest loss in the company history' }
          ]
        },
        {
          id: 'q16',
          number: 16,
          part: 1,
          type: 'matching_headings',
          prompt: 'Paragraph C',
          correctAnswer: 'A slimmer, more profitable company finally wins praise',
          explanation: 'Paragraph C explains how the new CEO cut pieces by half and sold off Legoland (slimmer), leading to quadrupled profits and overtaking Ferrari as the world most powerful brand (praise).',
          evidenceSentence: 'cut the number of different pieces it produced by half... Within a few years its profits had quadrupled... greatest turnaround in corporate history.',
          evidenceSentenceId: 'para-c',
          errorTag: 'lexical_gap',
          paraphrasePairs: [
            { questionKeyword: 'slimmer', passageKeyword: 'cut pieces by half, sold off Legoland' },
            { questionKeyword: 'more profitable', passageKeyword: 'profits had quadrupled' },
            { questionKeyword: 'wins praise', passageKeyword: 'called the greatest turnaround in corporate history' }
          ]
        },
        {
          id: 'q17',
          number: 17,
          part: 1,
          type: 'matching_headings',
          prompt: 'Paragraph D',
          correctAnswer: 'Amateur designers create successful products',
          explanation: "Paragraph D talks about fan-submitted designs on Lego Ideas. Successful fan designs became official Lego sets, like Women of NASA becoming Amazon's best-selling toy.",
          evidenceSentence: 'fans can submit designs for new sets... the few designs that are chosen become official Lego sets... Women of NASA became Amazon best-selling toy.',
          evidenceSentenceId: 'para-d',
          errorTag: 'lexical_gap',
          paraphrasePairs: [
            { questionKeyword: 'amateur designers', passageKeyword: 'fans who originally created them' },
            { questionKeyword: 'successful products', passageKeyword: "official Lego sets, Amazon's best-selling toy" }
          ]
        },
        {
          id: 'q18',
          number: 18,
          part: 1,
          type: 'matching_headings',
          prompt: 'Paragraph E',
          correctAnswer: 'A sad farewell for online players',
          explanation: 'Paragraph E discusses Lego Universe, an online game that was shut down due to insufficient paying subscribers, with children crying as it closed.',
          evidenceSentence: 'players of Lego Universe, an online game... shut the game down... Scott Brown recalled seeing children cry as it shut down.',
          evidenceSentenceId: 'para-e',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'sad farewell', passageKeyword: 'seeing children cry as it shut down' },
            { questionKeyword: 'online players', passageKeyword: 'players of Lego Universe, an online game' }
          ]
        },
        {
          id: 'q19',
          number: 19,
          part: 1,
          type: 'matching_headings',
          prompt: 'Paragraph F',
          correctAnswer: 'A worldwide emergency tests the business',
          explanation: 'Paragraph F describes how coronavirus closed retailers and suspended factories (worldwide emergency), yet Lego adapted and revenues rose 13%.',
          evidenceSentence: 'the coronavirus forced toy retailers around the world to close their doors temporarily. Its factories in China and Mexico also suspended production...',
          evidenceSentenceId: 'para-f',
          errorTag: 'lexical_gap',
          paraphrasePairs: [
            { questionKeyword: 'worldwide emergency', passageKeyword: 'the coronavirus forced retailers around the world to close' },
            { questionKeyword: 'tests the business', passageKeyword: 'transporting products around the world more expensive' }
          ]
        },
        {
          id: 'q20',
          number: 20,
          part: 1,
          type: 'matching_headings',
          prompt: 'Paragraph G',
          correctAnswer: 'An unexpected answer to an environmental problem',
          explanation: 'Paragraph G explains that making bricks from recycled bottles was abandoned because it caused more emissions. The real sustainable answer was the durability of existing bricks.',
          evidenceSentence: 'it may turn out that the most sustainable Lego brick is one that already exists... bricks are designed to be durable enough to be handed down through generations.',
          evidenceSentenceId: 'para-g',
          errorTag: 'overthinking_logic',
          paraphrasePairs: [
            { questionKeyword: 'environmental problem', passageKeyword: 'reduce carbon emissions, petroleum substitute' },
            { questionKeyword: 'unexpected answer', passageKeyword: 'the most sustainable Lego brick is one that already exists' }
          ]
        },
        {
          id: 'q21',
          number: 21,
          part: 1,
          type: 'mcq_single',
          prompt: 'What does the writer say about the brick in Paragraph B?',
          options: [
            { label: 'A', text: 'It was too difficult to use.' },
            { label: 'B', text: 'It was badly made.' },
            { label: 'C', text: 'It was cheaper than other toys.' },
            { label: 'D', text: 'It was about to lose its leading position.' }
          ],
          correctAnswer: 'D',
          explanation: "Paragraph B begins: 'But the brick's days at the top of the toy box were numbered.' 'Days were numbered' is an idiom meaning its dominant status was about to end.",
          evidenceSentence: "But the brick's days at the top of the toy box were numbered.",
          evidenceSentenceId: 'para-b',
          errorTag: 'lexical_gap',
          paraphrasePairs: [
            { questionKeyword: 'lose its leading position', passageKeyword: "days at the top of the toy box were numbered" }
          ],
          distractorExplanations: {
            'A': 'Bài không nhắc đến việc gạch Lego khó sử dụng.',
            'B': 'Bài chỉ nói các sản phẩm nhái (imitations by rivals) kém chất lượng, không phải gạch Lego gốc.',
            'C': 'Bài không nói Lego rẻ hơn đồ chơi khác.'
          }
        },
        {
          id: 'q22',
          number: 22,
          part: 1,
          type: 'mcq_single',
          prompt: 'After taking charge as chief executive, Knudstorp',
          options: [
            { label: 'A', text: 'invested in new theme parks.' },
            { label: 'B', text: 'made the organisation smaller and simpler.' },
            { label: 'C', text: 'moved its head office to another country.' },
            { label: 'D', text: 'changed the company\'s name.' }
          ],
          correctAnswer: 'B',
          explanation: 'Paragraph C states Knudstorp sold off Legoland theme parks and cut the number of pieces produced by half to just 6,500, creating a leaner company.',
          evidenceSentence: 'cut the number of different pieces it produced by half, to just 6,500... The leaner company soon proved them wrong.',
          evidenceSentenceId: 'para-c',
          errorTag: 'lexical_gap',
          paraphrasePairs: [
            { questionKeyword: 'made the organisation smaller and simpler', passageKeyword: 'cut pieces by half, leaner company' }
          ],
          distractorExplanations: {
            'A': 'Ông bán công viên (sold off Legoland parks), không phải đầu tư xây mới.',
            'C': 'Không nhắc đến việc chuyển trụ sở ra nước ngoài.',
            'D': 'Không nhắc đến việc đổi tên công ty.'
          }
        },
        {
          id: 'q23',
          number: 23,
          part: 1,
          type: 'mcq_single',
          prompt: "Before Lego considers a fan's suggestion, the suggestion has to",
          options: [
            { label: 'A', text: 'be submitted from Japan.' },
            { label: 'B', text: 'have already earned money from sales.' },
            { label: 'C', text: "prove popular with the site's users." },
            { label: 'D', text: "come from one of the company's employees." }
          ],
          correctAnswer: 'C',
          explanation: 'Paragraph D states: "the company will only examine a design once at least 10,000 other fans have given it their online support."',
          evidenceSentence: 'the company will only examine a design once at least 10,000 other fans have given it their online support.',
          evidenceSentenceId: 'para-d',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: "prove popular with the site's users", passageKeyword: 'at least 10,000 other fans have given it their online support' }
          ],
          distractorExplanations: {
            'A': 'Thử nghiệm ban đầu ở Nhật, nhưng hiện tại ai cũng tham gia được.',
            'B': 'Doanh thu 1% chỉ được trả SAU khi sản phẩm chính thức phát hành, không phải điều kiện trước khi xét duyệt.',
            'D': 'Ý tưởng đến từ người hâm mộ (fans/amateurs), không phải nhân viên.'
          }
        },
        {
          id: 'q24',
          number: 24,
          part: 1,
          type: 'gap_fill',
          prompt: 'By the end of the year it had raised its [24], and its profits had risen even more.',
          correctAnswer: 'revenue',
          explanation: "Paragraph F states: 'Over the year as a whole, the company's revenue rose by 13 per cent, and its operating profit grew even faster.'",
          evidenceSentence: "Over the year as a whole, the company's revenue rose by 13 per cent, and its operating profit grew even faster.",
          evidenceSentenceId: 'para-f',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'raised', passageKeyword: 'rose by 13 per cent' }
          ]
        },
        {
          id: 'q25',
          number: 25,
          part: 1,
          type: 'gap_fill',
          prompt: 'Calculations suggested that, on average, one used bottle could supply the plastic for a total of [25] bricks.',
          correctAnswer: 'ten',
          explanation: "Paragraph G states: 'On average, it calculated, a single one-litre bottle would provide enough plastic to make ten of them.'",
          evidenceSentence: 'On average, it calculated, a single one-litre bottle would provide enough plastic to make ten of them.',
          evidenceSentenceId: 'para-g',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'supply the plastic for a total of', passageKeyword: 'provide enough plastic to make' }
          ]
        },
        {
          id: 'q26',
          number: 26,
          part: 1,
          type: 'gap_fill',
          prompt: 'Toys that pass [26] standards of safety can last for decades.',
          correctAnswer: 'strict',
          explanation: "Paragraph G states: 'The safety standards that every Lego brick has to meet are extremely strict, and the bricks are designed to be durable enough to be handed down through generations.'",
          evidenceSentence: 'The safety standards that every Lego brick has to meet are extremely strict',
          evidenceSentenceId: 'para-g',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'pass strict standards', passageKeyword: 'safety standards ... are extremely strict' },
            { questionKeyword: 'last for decades', passageKeyword: 'handed down through generations' }
          ]
        }
      ]
    }
  ]
};
