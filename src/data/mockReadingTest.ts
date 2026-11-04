import { IELTSExam } from '@/types/ielts';

export const mockReadingExam: IELTSExam = {
  id: 'cambridge-18-academic-reading-test-1',
  title: 'Cambridge IELTS 18 - Academic Reading Test 1',
  module: 'reading',
  category: 'Academic',
  durationMinutes: 60,
  parts: [
    {
      partNumber: 1,
      title: 'Reading Passage 1',
      subtitle: 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.',
      instructions: 'Read the text below and answer Questions 1-13.',
      passage: {
        id: 'passage-1',
        title: 'The Roman Shipwrecks of Pisa',
        paragraphs: [
          {
            id: 'p1-1',
            label: '1',
            text: 'In 1998, construction workers digging near the San Rossore train station outside the ancient Italian city of Pisa unearthed the remains of wooden timbers. Archeologists rushed to the site, expecting to find ordinary remnants of medieval foundations. Instead, they stumbled upon one of the most remarkable nautical discoveries of the twentieth century: a submerged harbor containing at least thirty ancient Roman merchant vessels, preserved almost intact under thick layers of silt and clay.'
          },
          {
            id: 'p1-2',
            label: '2',
            text: 'Radiocarbon dating and numismatic analysis revealed that the ships sank between the second century BC and the fifth century AD. The site had once been the confluence of the Serchio and Arno rivers, where violent flash floods from the Apennine mountains repeatedly swept down toward the Ligurian Sea. Over several centuries, cataclysmic floods struck the harbor without warning, trapping ships anchored at port, battering them into the mud, and sealing them in anaerobic sediments that arrested biological decay.'
          },
          {
            id: 'p1-3',
            label: '3',
            text: 'Among the vessels recovered was an 18-meter-long cargo vessel designated "Alkedo" (the Gull), built of oak and pine, which carried an intact carved figurehead of a roaring lion. Another large craft, dubbed "Nave I", was loaded with amphorae stamped with markings from modern-day Spain and Tunisia, containing olives, fish sauce (garum), and fine vintage wine. The sheer variety of goods provides unprecedented empirical proof of extensive trans-Mediterranean trading networks spanning North Africa, Iberia, and the Italian peninsula.'
          },
          {
            id: 'p1-4',
            label: '4',
            text: 'Excavating ancient waterlogged wood presents enormous technical challenges. When timber remains submerged for millennia, cellulose breaks down, leaving water molecules to maintain the physical cell structure. If exposed prematurely to ambient air, rapid evaporation causes catastrophic shrinkage, warpage, and structural collapse. To prevent this, conservators sprayed the vessels with chilled water and biocides before transporting them into climate-controlled laboratories.'
          },
          {
            id: 'p1-5',
            label: '5',
            text: 'To stabilize the wood permanently, scientists immersed the timbers in warm vats of polyethylene glycol (PEG), a synthetic polymer that progressively infiltrates timber cell cavities and displaces moisture. After several months of chemical saturation, the timber could safely be freeze-dried without cellular damage. Today, the restored ships are proudly exhibited at the Museum of Ancient Ships of Pisa, offering modern visitors an intimate window into classical engineering and maritime commerce.'
          }
        ]
      },
      questions: [
        {
          id: 'q1',
          number: 1,
          part: 1,
          type: 'tfng',
          prompt: 'Archaeologists expected to find ancient Roman ships when they first examined the excavation site at Pisa in 1998.',
          correctAnswer: 'FALSE',
          explanation: 'Paragraph 1 states archeologists rushed to the site "expecting to find ordinary remnants of medieval foundations", not Roman ships.',
          evidenceSentence: 'Archeologists rushed to the site, expecting to find ordinary remnants of medieval foundations.',
          evidenceSentenceId: 'p1-1',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'expected to find ancient Roman ships', passageKeyword: 'expecting to find ordinary remnants of medieval foundations' },
            { questionKeyword: 'first examined the excavation site', passageKeyword: 'rushed to the site' }
          ],
          distractorExplanations: {
            'TRUE': 'Thông tin trong bài đối lập trực tiếp: các nhà khảo cổ chỉ kỳ vọng tìm thấy móng thời Trung cổ, không phải tàu La Mã cổ đại.',
            'NOT GIVEN': 'Thông tin có xuất hiện rõ ràng trong bài, không phải không được đề cập.'
          }
        },
        {
          id: 'q2',
          number: 2,
          part: 1,
          type: 'tfng',
          prompt: 'The ships discovered at San Rossore were all wrecked during a single catastrophic flood.',
          correctAnswer: 'FALSE',
          explanation: 'Paragraph 2 mentions the ships sank "between the second century BC and the fifth century AD" and "Over several centuries, cataclysmic floods struck the harbor", indicating multiple floods over hundreds of years.',
          evidenceSentence: 'Radiocarbon dating and numismatic analysis revealed that the ships sank between the second century BC and the fifth century AD.',
          evidenceSentenceId: 'p1-2',
          errorTag: 'scanning_oversight',
          paraphrasePairs: [
            { questionKeyword: 'during a single catastrophic flood', passageKeyword: 'Over several centuries, cataclysmic floods struck the harbor' }
          ],
          distractorExplanations: {
            'TRUE': 'Bài đọc nêu rõ tai nạn diễn ra rải rác qua nhiều thế kỷ (từ thế kỷ 2 TCN đến thế kỷ 5 SCN), không phải trong một trận lũ duy nhất.'
          }
        },
        {
          id: 'q3',
          number: 3,
          part: 1,
          type: 'tfng',
          prompt: 'The lack of oxygen in the mud helped protect the wooden vessels from biological decay.',
          correctAnswer: 'TRUE',
          explanation: 'Paragraph 2 states the ships were sealed in "anaerobic sediments that arrested biological decay". Anaerobic means without oxygen.',
          evidenceSentence: 'battering them into the mud, and sealing them in anaerobic sediments that arrested biological decay.',
          evidenceSentenceId: 'p1-2',
          errorTag: 'lexical_gap',
          paraphrasePairs: [
            { questionKeyword: 'lack of oxygen', passageKeyword: 'anaerobic sediments (trầm tích yếm khí / kị khí)' },
            { questionKeyword: 'helped protect ... from biological decay', passageKeyword: 'arrested biological decay (ngăn chặn sự phân hủy sinh học)' }
          ],
          distractorExplanations: {
            'FALSE': 'Bài đọc khẳng định chính xác môi trường trầm tích yếm khí đã ngăn chặn phân hủy sinh học.'
          }
        },
        {
          id: 'q4',
          number: 4,
          part: 1,
          type: 'tfng',
          prompt: 'The ship named Alkedo was the largest vessel ever constructed in the Roman Empire.',
          correctAnswer: 'NOT GIVEN',
          explanation: 'Paragraph 3 mentions Alkedo was an 18-meter-long cargo vessel with a carved lion figurehead, but gives no indication whether it was the largest vessel ever built in the empire.',
          evidenceSentence: 'Among the vessels recovered was an 18-meter-long cargo vessel designated "Alkedo" (the Gull), built of oak and pine, which carried an intact carved figurehead of a roaring lion.',
          evidenceSentenceId: 'p1-3',
          errorTag: 'overthinking_logic',
          distractorExplanations: {
            'TRUE': 'Bẫy suy diễn: Đoạn văn chỉ miêu tả tàu dài 18m, hoàn toàn không so sánh với kỷ lục các con tàu khác của đế chế La Mã.',
            'FALSE': 'Bài không nói nó là lớn nhất, nhưng cũng không phủ định điều đó $\\rightarrow$ NOT GIVEN.'
          }
        },
        {
          id: 'q5',
          number: 5,
          part: 1,
          type: 'tfng',
          prompt: 'Amphorae found on Nave I verified commercial connections between Italy, Spain, and North Africa.',
          correctAnswer: 'TRUE',
          explanation: 'Paragraph 3 states Nave I carried amphorae from modern-day Spain and Tunisia, providing empirical proof of trading networks spanning North Africa, Iberia, and the Italian peninsula.',
          evidenceSentence: 'The sheer variety of goods provides unprecedented empirical proof of extensive trans-Mediterranean trading networks spanning North Africa, Iberia, and the Italian peninsula.',
          evidenceSentenceId: 'p1-3',
          errorTag: 'lexical_gap',
          paraphrasePairs: [
            { questionKeyword: 'verified commercial connections', passageKeyword: 'unprecedented empirical proof of extensive trading networks' },
            { questionKeyword: 'Spain and North Africa', passageKeyword: 'Iberia, and North Africa (Tunisia)' }
          ]
        },
        {
          id: 'q6',
          number: 6,
          part: 1,
          type: 'tfng',
          prompt: 'Polyethylene glycol (PEG) evaporates quickly when exposed to sunlight.',
          correctAnswer: 'NOT GIVEN',
          explanation: 'Paragraph 5 describes PEG as a synthetic polymer that displaces moisture in cell cavities, but does not mention how it behaves under sunlight.',
          evidenceSentence: 'To stabilize the wood permanently, scientists immersed the timbers in warm vats of polyethylene glycol (PEG), a synthetic polymer that progressively infiltrates timber cell cavities and displaces moisture.'
        },
        {
          id: 'q7',
          number: 7,
          part: 1,
          type: 'tfng',
          prompt: 'Visitors can currently see the restored vessels in a public museum in Pisa.',
          correctAnswer: 'TRUE',
          explanation: 'Paragraph 5 confirms that "Today, the restored ships are proudly exhibited at the Museum of Ancient Ships of Pisa".',
          evidenceSentence: 'Today, the restored ships are proudly exhibited at the Museum of Ancient Ships of Pisa, offering modern visitors an intimate window into classical engineering and maritime commerce.'
        },
        {
          id: 'q8',
          number: 8,
          part: 1,
          type: 'gap_fill',
          prompt: 'Over millennia underwater, the ________ within timber cells gradually deteriorates.',
          gapLabel: 'Question 8',
          correctAnswer: 'cellulose',
          acceptableAnswers: ['cellulose'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 4 states that when timber remains submerged for millennia, "cellulose breaks down".',
          evidenceSentence: 'When timber remains submerged for millennia, cellulose breaks down, leaving water molecules to maintain the physical cell structure.'
        },
        {
          id: 'q9',
          number: 9,
          part: 1,
          type: 'gap_fill',
          prompt: 'Without moisture, rapid ________ will result in severe distortion and structural collapse.',
          gapLabel: 'Question 9',
          correctAnswer: 'evaporation',
          acceptableAnswers: ['evaporation'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 4 notes that if exposed prematurely to ambient air, "rapid evaporation causes catastrophic shrinkage, warpage, and structural collapse".',
          evidenceSentence: 'If exposed prematurely to ambient air, rapid evaporation causes catastrophic shrinkage, warpage, and structural collapse.'
        },
        {
          id: 'q10',
          number: 10,
          part: 1,
          type: 'gap_fill',
          prompt: 'Conservators initially treated the uncovered ships using chilled water and ________.',
          gapLabel: 'Question 10',
          correctAnswer: 'biocides',
          acceptableAnswers: ['biocides'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 4 states "conservators sprayed the vessels with chilled water and biocides".',
          evidenceSentence: 'To prevent this, conservators sprayed the vessels with chilled water and biocides before transporting them into climate-controlled laboratories.'
        },
        {
          id: 'q11',
          number: 11,
          part: 1,
          type: 'gap_fill',
          prompt: 'To replace the water inside the timber cells, scientists used a synthetic ________ known as PEG.',
          gapLabel: 'Question 11',
          correctAnswer: 'polymer',
          acceptableAnswers: ['polymer'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 5 mentions "polyethylene glycol (PEG), a synthetic polymer that progressively infiltrates timber cell cavities".',
          evidenceSentence: 'scientists immersed the timbers in warm vats of polyethylene glycol (PEG), a synthetic polymer that progressively infiltrates timber cell cavities and displaces moisture.'
        },
        {
          id: 'q12',
          number: 12,
          part: 1,
          type: 'gap_fill',
          prompt: 'Following chemical treatment, the timbers could be safely ________ without sustaining damage.',
          gapLabel: 'Question 12',
          correctAnswer: 'freeze-dried',
          acceptableAnswers: ['freeze-dried', 'freeze dried'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 5 states that after months of saturation, "the timber could safely be freeze-dried without cellular damage".',
          evidenceSentence: 'After several months of chemical saturation, the timber could safely be freeze-dried without cellular damage.'
        },
        {
          id: 'q13',
          number: 13,
          part: 1,
          type: 'gap_fill',
          prompt: 'The recovered ship Nave I carried containers of olives, wine, and a fish sauce known as ________.',
          gapLabel: 'Question 13',
          correctAnswer: 'garum',
          acceptableAnswers: ['garum'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 3 mentions amphorae "containing olives, fish sauce (garum), and fine vintage wine".',
          evidenceSentence: 'Another large craft, dubbed "Nave I", was loaded with amphorae stamped with markings from modern-day Spain and Tunisia, containing olives, fish sauce (garum), and fine vintage wine.'
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Reading Passage 2',
      subtitle: 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.',
      instructions: 'Read the text below and answer Questions 14-26.',
      passage: {
        id: 'passage-2',
        title: 'The Secrets of Forest Communication',
        paragraphs: [
          {
            id: 'p2-A',
            label: 'A',
            text: 'For centuries, traditional forestry regarded trees as solitary, fiercely competitive organisms vying ruthlessly against one another for solar radiation, subterranean minerals, and soil moisture. Silvicultural doctrine held that weeding out weaker neighbors was indispensable to optimizing the timber yield of dominant specimens. In recent decades, however, revolutionary research spearheaded by forest ecologist Dr. Suzanne Simard has upended this orthodox paradigm, revealing that temperate forests operate not as battlegrounds of isolated individuals, but as cooperative, highly integrated super-organisms linked by an underground fungal web popularly termed the "Wood Wide Web".'
          },
          {
            id: 'p2-B',
            label: 'B',
            text: 'At the heart of this subterranean nexus are mycorrhizal fungi. These microscopic filamentous networks establish symbiotic relationships with tree roots. Incapable of photosynthesis themselves, the mycorrhizae rely on trees to supply carbon-rich sugars generated through solar capture. In return, the expansive fungal mycelium, with surface areas thousands of times greater than root systems alone, extracts vital phosphorus, nitrogen, and groundwater from tiny soil fissures, channeling these nutrients straight into host tree vascular systems.'
          },
          {
            id: 'p2-C',
            label: 'C',
            text: 'Crucially, these fungal conduits do not connect merely a single tree to its immediate root neighbors. Radioactive carbon-14 isotope tracking experiments demonstrated that carbon flows freely between entirely different species. In summer, when mature Douglas firs enjoy abundant sun, they pump excess carbon and nitrogen through the fungal network to shade-stunted paper birch saplings. In winter, when birches lose their deciduous foliage, the metabolic flow reverses, with the birches returning stored nutrients to evergreen firs. Rather than zero-sum competition, the ecosystem engages in dynamic, mutualistic equilibrium.'
          },
          {
            id: 'p2-D',
            label: 'D',
            text: 'Beyond nutrient reallocation, the network functions as an early warning communication channel against biotic threats. When aphid infestations or bark beetles begin defoliating a particular tree, that victim releases volatile chemical distress signals into both the atmosphere and the underground fungal pipeline. Within hours, neighboring unaffected trees synthesize protective compounds, such as tannin defensins and enzyme inhibitors that make their foliage unpalatable to predatory insects, before a single insect has landed on their leaves.'
          },
          {
            id: 'p2-E',
            label: 'E',
            text: 'Particularly venerable, mature specimens—dubbed "Mother Trees"—act as central logistical hubs in the forest architecture. An individual Mother Tree may connect to hundreds of younger surrounding saplings. When an ancient Mother Tree is fatally injured or approaches natural senescence, she rapidly distributes her lifetime store of carbon, defense enzymes, and genetic memory to the next generation, drastically boosting their survival rates in what researchers describe as an act of generational stewardship.'
          },
          {
            id: 'p2-F',
            label: 'F',
            text: 'These discoveries have far-reaching implications for commercial forestry and climate conservation. Conventional clear-cutting practices, which raze mature trees and sterilize native soils with chemical herbicides, inadvertently obliterate the delicate fungal infrastructure. Without their underground mycorrhizal life-support system, newly planted monoculture seedlings frequently suffer high mortality and vulnerability to disease. Progressive conservationists now champion selective logging techniques that deliberately preserve Mother Trees and maintain soil fungal continuity.'
          }
        ]
      },
      questions: [
        {
          id: 'q14',
          number: 14,
          part: 2,
          type: 'matching_headings',
          prompt: 'Paragraph A',
          headingList: [
            { id: 'h1', roman: 'i', text: 'Nutrient sharing between diverse tree species' },
            { id: 'h2', roman: 'ii', text: 'A paradigm shift from competition to cooperation' },
            { id: 'h3', roman: 'iii', text: 'The anatomy and exchange of mycorrhizal symbiosis' },
            { id: 'h4', roman: 'iv', text: 'Practical lessons for forestry and sustainable management' },
            { id: 'h5', roman: 'v', text: 'Subterranean defense alerts against pest predation' },
            { id: 'h6', roman: 'vi', text: 'The vital leadership and legacy of Mother Trees' },
            { id: 'h7', roman: 'vii', text: 'Technological tools used to track underground isotopes' }
          ],
          correctAnswer: 'ii',
          explanation: 'Paragraph A explains how traditional forestry saw trees as competitive, until Simard showed they operate as cooperative super-organisms.',
          evidenceSentence: 'upended this orthodox paradigm, revealing that temperate forests operate not as battlegrounds of isolated individuals, but as cooperative, highly integrated super-organisms'
        },
        {
          id: 'q15',
          number: 15,
          part: 2,
          type: 'matching_headings',
          prompt: 'Paragraph B',
          headingList: [
            { id: 'h1', roman: 'i', text: 'Nutrient sharing between diverse tree species' },
            { id: 'h2', roman: 'ii', text: 'A paradigm shift from competition to cooperation' },
            { id: 'h3', roman: 'iii', text: 'The anatomy and exchange of mycorrhizal symbiosis' },
            { id: 'h4', roman: 'iv', text: 'Practical lessons for forestry and sustainable management' },
            { id: 'h5', roman: 'v', text: 'Subterranean defense alerts against pest predation' },
            { id: 'h6', roman: 'vi', text: 'The vital leadership and legacy of Mother Trees' },
            { id: 'h7', roman: 'vii', text: 'Technological tools used to track underground isotopes' }
          ],
          correctAnswer: 'iii',
          explanation: 'Paragraph B details how mycorrhizal fungi and tree roots exchange carbon sugars for nitrogen, phosphorus, and water.',
          evidenceSentence: 'These microscopic filamentous networks establish symbiotic relationships with tree roots. Incapable of photosynthesis themselves, the mycorrhizae rely on trees to supply carbon-rich sugars'
        },
        {
          id: 'q16',
          number: 16,
          part: 2,
          type: 'matching_headings',
          prompt: 'Paragraph C',
          headingList: [
            { id: 'h1', roman: 'i', text: 'Nutrient sharing between diverse tree species' },
            { id: 'h2', roman: 'ii', text: 'A paradigm shift from competition to cooperation' },
            { id: 'h3', roman: 'iii', text: 'The anatomy and exchange of mycorrhizal symbiosis' },
            { id: 'h4', roman: 'iv', text: 'Practical lessons for forestry and sustainable management' },
            { id: 'h5', roman: 'v', text: 'Subterranean defense alerts against pest predation' },
            { id: 'h6', roman: 'vi', text: 'The vital leadership and legacy of Mother Trees' },
            { id: 'h7', roman: 'vii', text: 'Technological tools used to track underground isotopes' }
          ],
          correctAnswer: 'i',
          explanation: 'Paragraph C explains reciprocal resource sharing between Douglas firs and paper birches across seasons.',
          evidenceSentence: 'Radioactive carbon-14 isotope tracking experiments demonstrated that carbon flows freely between entirely different species.'
        },
        {
          id: 'q17',
          number: 17,
          part: 2,
          type: 'matching_headings',
          prompt: 'Paragraph D',
          headingList: [
            { id: 'h1', roman: 'i', text: 'Nutrient sharing between diverse tree species' },
            { id: 'h2', roman: 'ii', text: 'A paradigm shift from competition to cooperation' },
            { id: 'h3', roman: 'iii', text: 'The anatomy and exchange of mycorrhizal symbiosis' },
            { id: 'h4', roman: 'iv', text: 'Practical lessons for forestry and sustainable management' },
            { id: 'h5', roman: 'v', text: 'Subterranean defense alerts against pest predation' },
            { id: 'h6', roman: 'vi', text: 'The vital leadership and legacy of Mother Trees' },
            { id: 'h7', roman: 'vii', text: 'Technological tools used to track underground isotopes' }
          ],
          correctAnswer: 'v',
          explanation: 'Paragraph D discusses distress signaling when insects attack and pre-emptive tannin production in neighboring trees.',
          evidenceSentence: 'Beyond nutrient reallocation, the network functions as an early warning communication channel against biotic threats.'
        },
        {
          id: 'q18',
          number: 18,
          part: 2,
          type: 'matching_headings',
          prompt: 'Paragraph E',
          headingList: [
            { id: 'h1', roman: 'i', text: 'Nutrient sharing between diverse tree species' },
            { id: 'h2', roman: 'ii', text: 'A paradigm shift from competition to cooperation' },
            { id: 'h3', roman: 'iii', text: 'The anatomy and exchange of mycorrhizal symbiosis' },
            { id: 'h4', roman: 'iv', text: 'Practical lessons for forestry and sustainable management' },
            { id: 'h5', roman: 'v', text: 'Subterranean defense alerts against pest predation' },
            { id: 'h6', roman: 'vi', text: 'The vital leadership and legacy of Mother Trees' },
            { id: 'h7', roman: 'vii', text: 'Technological tools used to track underground isotopes' }
          ],
          correctAnswer: 'vi',
          explanation: 'Paragraph E explores the central role of Mother Trees in nurturing saplings and passing on resources prior to death.',
          evidenceSentence: 'Particularly venerable, mature specimens—dubbed "Mother Trees"—act as central logistical hubs in the forest architecture.'
        },
        {
          id: 'q19',
          number: 19,
          part: 2,
          type: 'matching_headings',
          prompt: 'Paragraph F',
          headingList: [
            { id: 'h1', roman: 'i', text: 'Nutrient sharing between diverse tree species' },
            { id: 'h2', roman: 'ii', text: 'A paradigm shift from competition to cooperation' },
            { id: 'h3', roman: 'iii', text: 'The anatomy and exchange of mycorrhizal symbiosis' },
            { id: 'h4', roman: 'iv', text: 'Practical lessons for forestry and sustainable management' },
            { id: 'h5', roman: 'v', text: 'Subterranean defense alerts against pest predation' },
            { id: 'h6', roman: 'vi', text: 'The vital leadership and legacy of Mother Trees' },
            { id: 'h7', roman: 'vii', text: 'Technological tools used to track underground isotopes' }
          ],
          correctAnswer: 'iv',
          explanation: 'Paragraph F highlights the consequences of clear-cutting and the modern adoption of selective logging.',
          evidenceSentence: 'These discoveries have far-reaching implications for commercial forestry and climate conservation.'
        },
        {
          id: 'q20',
          number: 20,
          part: 2,
          type: 'mcq_single',
          prompt: 'According to Paragraph B, mycorrhizal fungi are unable to:',
          options: [
            { label: 'A', text: 'Absorb nitrogen and phosphorus from soil crevices' },
            { label: 'B', text: 'Manufacture sugars through photosynthesis' },
            { label: 'C', text: 'Establish physical contact with tree roots' },
            { label: 'D', text: 'Survive in temperate forest climates' }
          ],
          correctAnswer: 'B',
          explanation: 'Paragraph B explicitly states that mycorrhizal fungi are "Incapable of photosynthesis themselves".',
          evidenceSentence: 'Incapable of photosynthesis themselves, the mycorrhizae rely on trees to supply carbon-rich sugars generated through solar capture.'
        },
        {
          id: 'q21',
          number: 21,
          part: 2,
          type: 'mcq_single',
          prompt: 'During winter months, paper birch trees:',
          options: [
            { label: 'A', text: 'Increase their photosynthetic output' },
            { label: 'B', text: 'Disconnect permanently from the fungal web' },
            { label: 'C', text: 'Send stored nutrients back to Douglas firs' },
            { label: 'D', text: 'Attack neighboring fir trees for light' }
          ],
          correctAnswer: 'C',
          explanation: 'Paragraph C states that in winter "the metabolic flow reverses, with the birches returning stored nutrients to evergreen firs".',
          evidenceSentence: 'In winter, when birches lose their deciduous foliage, the metabolic flow reverses, with the birches returning stored nutrients to evergreen firs.'
        },
        {
          id: 'q22',
          number: 22,
          part: 2,
          type: 'mcq_single',
          prompt: 'What defensive action do unharmed trees take upon receiving warning signals?',
          options: [
            { label: 'A', text: 'They shed all their leaves immediately' },
            { label: 'B', text: 'They manufacture chemicals that make foliage unpalatable' },
            { label: 'C', text: 'They send predatory insects toward the afflicted tree' },
            { label: 'D', text: 'They close root pores to block incoming fungal signals' }
          ],
          correctAnswer: 'B',
          explanation: 'Paragraph D states neighboring trees "synthesize protective compounds, such as tannin defensins and enzyme inhibitors that make their foliage unpalatable".',
          evidenceSentence: 'neighboring unaffected trees synthesize protective compounds, such as tannin defensins and enzyme inhibitors that make their foliage unpalatable to predatory insects'
        },
        {
          id: 'q23',
          number: 23,
          part: 2,
          type: 'matching_information',
          prompt: 'Evidence of dynamic two-way resource transfer between evergreen and deciduous species',
          options: [
            { label: 'A', text: 'Paragraph A' },
            { label: 'B', text: 'Paragraph B' },
            { label: 'C', text: 'Paragraph C' },
            { label: 'D', text: 'Paragraph D' },
            { label: 'E', text: 'Paragraph E' },
            { label: 'F', text: 'Paragraph F' }
          ],
          correctAnswer: 'C',
          explanation: 'Paragraph C describes the seasonal trade between firs and birches.',
          evidenceSentence: 'In summer, when mature Douglas firs enjoy abundant sun, they pump excess carbon and nitrogen through the fungal network to shade-stunted paper birch saplings.'
        },
        {
          id: 'q24',
          number: 24,
          part: 2,
          type: 'matching_information',
          prompt: 'The negative consequences of clear-cutting on soil microbiology',
          options: [
            { label: 'A', text: 'Paragraph A' },
            { label: 'B', text: 'Paragraph B' },
            { label: 'C', text: 'Paragraph C' },
            { label: 'D', text: 'Paragraph D' },
            { label: 'E', text: 'Paragraph E' },
            { label: 'F', text: 'Paragraph F' }
          ],
          correctAnswer: 'F',
          explanation: 'Paragraph F explains how clear-cutting and chemical sprays obliterate mycorrhizal infrastructure.',
          evidenceSentence: 'Conventional clear-cutting practices, which raze mature trees and sterilize native soils with chemical herbicides, inadvertently obliterate the delicate fungal infrastructure.'
        },
        {
          id: 'q25',
          number: 25,
          part: 2,
          type: 'matching_information',
          prompt: 'How an older tree transmits vital assets before dying',
          options: [
            { label: 'A', text: 'Paragraph A' },
            { label: 'B', text: 'Paragraph B' },
            { label: 'C', text: 'Paragraph C' },
            { label: 'D', text: 'Paragraph D' },
            { label: 'E', text: 'Paragraph E' },
            { label: 'F', text: 'Paragraph F' }
          ],
          correctAnswer: 'E',
          explanation: 'Paragraph E describes how a dying Mother Tree transmits carbon, enzymes, and genetic memory to saplings.',
          evidenceSentence: 'When an ancient Mother Tree is fatally injured or approaches natural senescence, she rapidly distributes her lifetime store of carbon, defense enzymes, and genetic memory'
        },
        {
          id: 'q26',
          number: 26,
          part: 2,
          type: 'matching_information',
          prompt: 'The historical misconception of trees being purely individualistic combatants',
          options: [
            { label: 'A', text: 'Paragraph A' },
            { label: 'B', text: 'Paragraph B' },
            { label: 'C', text: 'Paragraph C' },
            { label: 'D', text: 'Paragraph D' },
            { label: 'E', text: 'Paragraph E' },
            { label: 'F', text: 'Paragraph F' }
          ],
          correctAnswer: 'A',
          explanation: 'Paragraph A discusses the old belief that trees were solitary organisms competing for resources.',
          evidenceSentence: 'For centuries, traditional forestry regarded trees as solitary, fiercely competitive organisms vying ruthlessly against one another'
        }
      ]
    },
    {
      partNumber: 3,
      title: 'Reading Passage 3',
      subtitle: 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.',
      instructions: 'Read the text below and answer Questions 27-40.',
      passage: {
        id: 'passage-3',
        title: 'Artificial Intelligence in Clinical Diagnostics',
        paragraphs: [
          {
            id: 'p3-1',
            label: '1',
            text: 'Across healthcare systems worldwide, the integration of deep learning and computer vision into radiological diagnostics represents a watershed moment. High-resolution convolutional neural networks (CNNs) trained on millions of annotated chest radiographs, retinal fundus photographs, and computed tomography (CT) scans now regularly achieve diagnostic sensitivity and specificity on par with or surpassing board-certified specialists. Particularly in oncology, algorithms capable of identifying sub-millimeter pulmonary nodules or microcalcifications in breast tissue have demonstrated significant reductions in false-negative outcomes.'
          },
          {
            id: 'p3-2',
            label: '2',
            text: 'Yet despite these exhilarating computational breakthroughs, deploying automated diagnostic software in real-world clinical workflows has unearthed formidable socio-technical hurdles. A primary obstacle is algorithmic brittleness stemming from distribution shift. A model trained exclusively on digital imaging archives from premier academic medical centers in North America often suffers sudden accuracy degradation when introduced to community clinics utilizing older hardware or alternative contrast mediums. Such models latch onto spurious statistical correlations—such as radiopaque hospital tags or scanner-specific artifact noise—rather than genuine pathological lesions.'
          },
          {
            id: 'p3-3',
            label: '3',
            text: 'Moreover, the opaque "black-box" architecture of multi-layered neural systems breeds skepticism among clinicians. When an algorithm flags an inconspicuous shadow as early-stage malignant melanoma, clinicians demand verifiable physiological explanations before subjecting a patient to invasive biopsies. Post-hoc saliency maps and heatmaps often generate comforting illusions of interpretability without offering rigorous causal justification, making medical malpractice liability ambiguous should an algorithm fail.'
          },
          {
            id: 'p3-4',
            label: '4',
            text: 'Rather than pursuing complete clinical automation, prominent medical ethicists argue for "centaur medicine"—a collaborative framework wherein AI serves as an augmented decision-support co-pilot. In controlled trials, hybrid radiologist-AI teams consistently outscore either human experts or autonomous algorithms operating independently. The machine excels at exhaustive, tireless pixel-level anomaly scanning, while the human specialist contextualizes findings against a patient\'s idiosyncratic clinical history, genetic predispositions, and nuanced verbal symptoms.'
          },
          {
            id: 'p3-5',
            label: '5',
            text: 'Ultimately, realizing the full potential of medical artificial intelligence requires harmonized regulatory standards, rigorous prospective randomized trials, and diverse international demographic datasets. Until validation protocols match the evidentiary rigor demanded of pharmaceutical therapeutics, AI will remain a potent diagnostic partner rather than an autonomous medical replacement.'
          }
        ]
      },
      questions: [
        {
          id: 'q27',
          number: 27,
          part: 3,
          type: 'mcq_multiple',
          prompt: 'Which TWO technical advantages of deep learning algorithms in oncology are highlighted in Paragraph 1?',
          options: [
            { label: 'A', text: 'Achieving diagnostic performance comparable to or exceeding board specialists' },
            { label: 'B', text: 'Eliminating the need for biopsy examinations in oncology patients' },
            { label: 'C', text: 'Detecting tiny lesions that might otherwise result in false-negative assessments' },
            { label: 'D', text: 'Standardizing hospital tags across different medical facilities' },
            { label: 'E', text: 'Decreasing the cost of purchasing high-resolution radiology scanners' }
          ],
          maxSelections: 2,
          correctAnswer: ['A', 'C'],
          explanation: 'Paragraph 1 notes CNNs "achieve diagnostic sensitivity and specificity on par with or surpassing board-certified specialists" (A) and identify "sub-millimeter pulmonary nodules... with significant reductions in false-negative outcomes" (C).',
          evidenceSentence: 'now regularly achieve diagnostic sensitivity and specificity on par with or surpassing board-certified specialists. Particularly in oncology, algorithms capable of identifying sub-millimeter pulmonary nodules... have demonstrated significant reductions in false-negative outcomes.'
        },
        {
          id: 'q28',
          number: 28,
          part: 3,
          type: 'mcq_multiple',
          prompt: 'Which TWO factors contribute to algorithmic performance decline when models are used in new clinics according to Paragraph 2?',
          options: [
            { label: 'A', text: 'Differences in hospital hardware or imaging contrast agents' },
            { label: 'B', text: 'Lack of trained radiologists in community medical centers' },
            { label: 'C', text: 'Relying on irrelevant image cues such as hospital tags' },
            { label: 'D', text: 'Overheating of computer servers running neural networks' },
            { label: 'E', text: 'Refusal of insurance providers to cover algorithmic scans' }
          ],
          maxSelections: 2,
          correctAnswer: ['A', 'C'],
          explanation: 'Paragraph 2 highlights "older hardware or alternative contrast mediums" (A) and algorithms latching onto "spurious statistical correlations—such as radiopaque hospital tags" (C).',
          evidenceSentence: 'community clinics utilizing older hardware or alternative contrast mediums. Such models latch onto spurious statistical correlations—such as radiopaque hospital tags or scanner-specific artifact noise'
        },
        {
          id: 'q29',
          number: 29,
          part: 3,
          type: 'mcq_single',
          prompt: 'According to Paragraph 3, clinicians hesitate to act purely on AI recommendations because:',
          options: [
            { label: 'A', text: 'Neural networks are too slow to produce timely reports' },
            { label: 'B', text: 'AI systems cannot provide transparent physiological reasoning for their classifications' },
            { label: 'C', text: 'Patients uniformly refuse to undergo automated screenings' },
            { label: 'D', text: 'Most software companies do not provide technical manuals' }
          ],
          correctAnswer: 'B',
          explanation: 'Paragraph 3 notes "the opaque \'black-box\' architecture... breeds skepticism" because clinicians demand verifiable physiological explanations before invasive biopsies.',
          evidenceSentence: 'clinicians demand verifiable physiological explanations before subjecting a patient to invasive biopsies.'
        },
        {
          id: 'q30',
          number: 30,
          part: 3,
          type: 'mcq_single',
          prompt: 'The concept of "centaur medicine" is best described as:',
          options: [
            { label: 'A', text: 'Replacing human doctors with robotic surgeons' },
            { label: 'B', text: 'Using veterinary radiology techniques for human patients' },
            { label: 'C', text: 'A collaborative partnership combining human judgment with computational power' },
            { label: 'D', text: 'Training medical students using artificial intelligence tutors' }
          ],
          correctAnswer: 'C',
          explanation: 'Paragraph 4 defines centaur medicine as a "collaborative framework wherein AI serves as an augmented decision-support co-pilot" alongside human specialists.',
          evidenceSentence: 'a collaborative framework wherein AI serves as an augmented decision-support co-pilot. In controlled trials, hybrid radiologist-AI teams consistently outscore either human experts or autonomous algorithms'
        },
        {
          id: 'q31',
          number: 31,
          part: 3,
          type: 'mcq_single',
          prompt: 'What unique capability does a human physician contribute that AI currently lacks according to Paragraph 4?',
          options: [
            { label: 'A', text: 'Tireless scanning of millions of image pixels' },
            { label: 'B', text: 'Contextualizing visual data against a patient\'s verbal symptoms and history' },
            { label: 'C', text: 'Detecting microscopic sub-millimeter tissue calcifications' },
            { label: 'D', text: 'Eliminating false-positive rates entirely in oncology' }
          ],
          correctAnswer: 'B',
          explanation: 'Paragraph 4 states "the human specialist contextualizes findings against a patient\'s idiosyncratic clinical history, genetic predispositions, and nuanced verbal symptoms".',
          evidenceSentence: 'the human specialist contextualizes findings against a patient\'s idiosyncratic clinical history, genetic predispositions, and nuanced verbal symptoms.'
        },
        {
          id: 'q32',
          number: 32,
          part: 3,
          type: 'gap_fill',
          prompt: 'Diagnostic performance often declines when models encounter a distribution ________ in new clinic settings.',
          gapLabel: 'Question 32',
          correctAnswer: 'shift',
          acceptableAnswers: ['shift'],
          instruction: 'Write ONE WORD ONLY from the text for each answer.',
          explanation: 'Paragraph 2 mentions "algorithmic brittleness stemming from distribution shift".',
          evidenceSentence: 'A primary obstacle is algorithmic brittleness stemming from distribution shift.'
        },
        {
          id: 'q33',
          number: 33,
          part: 3,
          type: 'gap_fill',
          prompt: 'Rather than real disease signs, models may mistakenly focus on scanner-specific artifact ________.',
          gapLabel: 'Question 33',
          correctAnswer: 'noise',
          acceptableAnswers: ['noise'],
          instruction: 'Write ONE WORD ONLY from the text for each answer.',
          explanation: 'Paragraph 2 refers to "scanner-specific artifact noise".',
          evidenceSentence: 'Such models latch onto spurious statistical correlations—such as radiopaque hospital tags or scanner-specific artifact noise'
        },
        {
          id: 'q34',
          number: 34,
          part: 3,
          type: 'gap_fill',
          prompt: 'Current visualization methods like saliency maps fail to offer clear ________ justification.',
          gapLabel: 'Question 34',
          correctAnswer: 'causal',
          acceptableAnswers: ['causal'],
          instruction: 'Write ONE WORD ONLY from the text for each answer.',
          explanation: 'Paragraph 3 notes heatmaps create comforting illusions "without offering rigorous causal justification".',
          evidenceSentence: 'Post-hoc saliency maps and heatmaps often generate comforting illusions of interpretability without offering rigorous causal justification'
        },
        {
          id: 'q35',
          number: 35,
          part: 3,
          type: 'gap_fill',
          prompt: 'Collaborative diagnostic trials demonstrate that hybrid teams operate as decision-support ________.',
          gapLabel: 'Question 35',
          correctAnswer: 'co-pilot',
          acceptableAnswers: ['co-pilot', 'copilot'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 4 describes AI serving as an "augmented decision-support co-pilot".',
          evidenceSentence: 'a collaborative framework wherein AI serves as an augmented decision-support co-pilot.'
        },
        {
          id: 'q36',
          number: 36,
          part: 3,
          type: 'gap_fill',
          prompt: 'Before AI can be widely trusted, its clinical validation must equal the evidentiary standards of ________.',
          gapLabel: 'Question 36',
          correctAnswer: 'pharmaceutical therapeutics',
          acceptableAnswers: ['pharmaceutical therapeutics', 'therapeutics'],
          instruction: 'Write NO MORE THAN TWO WORDS from the text for each answer.',
          explanation: 'Paragraph 5 emphasizes that validation must match "the evidentiary rigor demanded of pharmaceutical therapeutics".',
          evidenceSentence: 'Until validation protocols match the evidentiary rigor demanded of pharmaceutical therapeutics, AI will remain a potent diagnostic partner'
        },
        {
          id: 'q37',
          number: 37,
          part: 3,
          type: 'ynng',
          prompt: 'Algorithms trained on data from top academic medical centers perform just as reliably when used in small community clinics.',
          correctAnswer: 'NO',
          explanation: 'Paragraph 2 explicitly states models suffer "sudden accuracy degradation when introduced to community clinics utilizing older hardware".',
          evidenceSentence: 'A model trained exclusively on digital imaging archives from premier academic medical centers in North America often suffers sudden accuracy degradation when introduced to community clinics'
        },
        {
          id: 'q38',
          number: 38,
          part: 3,
          type: 'ynng',
          prompt: 'Determining legal liability for medical mistakes is straightforward when using AI diagnostic software.',
          correctAnswer: 'NO',
          explanation: 'Paragraph 3 concludes by noting that it makes "medical malpractice liability ambiguous should an algorithm fail".',
          evidenceSentence: 'making medical malpractice liability ambiguous should an algorithm fail.'
        },
        {
          id: 'q39',
          number: 39,
          part: 3,
          type: 'ynng',
          prompt: 'In clinical trials, human radiologists working together with AI achieved higher accuracy than either working alone.',
          correctAnswer: 'YES',
          explanation: 'Paragraph 4 affirms: "hybrid radiologist-AI teams consistently outscore either human experts or autonomous algorithms operating independently".',
          evidenceSentence: 'In controlled trials, hybrid radiologist-AI teams consistently outscore either human experts or autonomous algorithms operating independently.'
        },
        {
          id: 'q40',
          number: 40,
          part: 3,
          type: 'ynng',
          prompt: 'Medical artificial intelligence will completely replace human radiologists within the next five years.',
          correctAnswer: 'NOT GIVEN',
          explanation: 'Paragraph 5 states AI remains a potent diagnostic partner rather than an autonomous replacement, but makes no prediction about a specific 5-year timeline.',
          evidenceSentence: 'Until validation protocols match the evidentiary rigor demanded of pharmaceutical therapeutics, AI will remain a potent diagnostic partner rather than an autonomous medical replacement.'
        }
      ]
    }
  ]
};
