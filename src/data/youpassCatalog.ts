import { IELTSExam } from '@/types/ielts';
import { youpassLegoExam } from '@/data/youpassLegoTest';

export interface YouPassTestItem {
  id: string;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  passage?: string;
  part?: string;
  task?: string;
  views: string;
  img: string;
  questionTypes: string[];
  source: string;
  durationMinutes: number;
}

export const youpassReadingCatalog: YouPassTestItem[] = [
  {
    "id": "r-1",
    "title": "[Simulation Q4] Predicting our future happiness",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "966 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/abacc55d-7d3f-4ce0-9653-5d983ca0ba75?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "YouPass Simulation",
    "durationMinutes": 20
  },
  {
    "id": "r-2",
    "title": "[YouPass Collect] - How popcorn came to the cinema",
    "skill": "reading",
    "passage": "Passage 1",
    "views": "14363 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/2c208bb0-2194-4afa-af20-72943a79f53d?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "True - False - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-3",
    "title": "[YouPass Collect] - The rise of short-sightedness",
    "skill": "reading",
    "passage": "Passage 2",
    "views": "5673 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/74f7e278-99a5-4e4f-9696-473a64bb159f?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Matching Features",
      "Matching Information"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-4",
    "title": "[YouPass Collect] - The Power of Strangers",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "3964 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/b0165b85-ca09-4ddc-ae5c-80ae92ac3bde?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-5",
    "title": "[YouPass Collect] - The Great Lock Controversy of 1851",
    "skill": "reading",
    "passage": "Passage 2",
    "views": "10705 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/f0736505-d06e-419a-b754-bacae95b6ccc?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Matching Information",
      "Multiple Choice (Many Answers)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-6",
    "title": "[YouPass Collect] - The rise and fall of the Gary Plan",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "5957 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/a9ca939f-8292-486e-a46a-49819ffa584e?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-7",
    "title": "[YouPass Collect] - Second thoughts on the Dunning-Kruger effect",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "3773 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/e6d81328-1624-4bda-be40-e616c5057876?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-8",
    "title": "[YouPass Collect] - The tulip traders of the Dutch Republic",
    "skill": "reading",
    "passage": "Passage 2",
    "views": "6007 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/ba9641be-5c06-4075-a789-aae6c92dc568?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Matching Information",
      "Multiple Choice (Many Answers)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-9",
    "title": "[YouPass Collect] - The Lord Howe Island stick insect",
    "skill": "reading",
    "passage": "Passage 1",
    "views": "10458 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/54d45179-f72e-4340-9a29-18b4fccefa2d?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "True - False - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-10",
    "title": "[YouPass Collect] - The World Cup ball",
    "skill": "reading",
    "passage": "Passage 1",
    "views": "10518 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/b9229fcd-ec1d-4e08-96c9-bb26483569e9?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "True - False - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-11",
    "title": "[Other sources] - The Whale Goes to Court",
    "skill": "reading",
    "passage": "Passage 1",
    "views": "40196 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/34711836-b145-40cb-884a-c73a3cda47be?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "True - False - Not Given"
    ],
    "source": "Other Sources",
    "durationMinutes": 20
  },
  {
    "id": "r-12",
    "title": "[YouPass Collect] - Vitamins – To supplement or not?",
    "skill": "reading",
    "passage": "Passage 2",
    "views": "51249 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/166fd366-2d6e-493e-9ea5-22c600fd42af?width=500&fit=cover",
    "questionTypes": [
      "Matching Features",
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-13",
    "title": "[YouPass Collect] - When people are ‘deaf’ to music",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "4988 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/4af40eed-4cf4-4e07-a2f7-49fb3d65f023?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given",
      "Other Types"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-14",
    "title": "[Actual Test] - Art-based training for engineers",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "5503 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/904cfea3-3cfb-46d6-aaa6-c8dfc7a36175?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "Actual Tests",
    "durationMinutes": 20
  },
  {
    "id": "r-15",
    "title": "[YouPass Collect] - A survivor's story",
    "skill": "reading",
    "passage": "Passage 1",
    "views": "21513 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/6ad7fd66-ce11-4a95-be55-380e5a7071b6?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "True - False - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-16",
    "title": "[YouPass Collect] - Tunnelling under the Thames",
    "skill": "reading",
    "passage": "Passage 1",
    "views": "25725 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/4e67ca05-ed02-4573-92fc-089f8f8709ac?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "True - False - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-17",
    "title": "[Actual Test] - On art and artists",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "3230 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/b86dfdfd-e333-4054-9042-f06be56f4a4d?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Matching Features",
      "Matching Information"
    ],
    "source": "Actual Tests",
    "durationMinutes": 20
  },
  {
    "id": "r-18",
    "title": "[Actual Test] - Marketing and Mind Control",
    "skill": "reading",
    "passage": "Passage 1",
    "views": "12187 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/bc400c7b-3f5f-400e-84e0-0f922af9d9ff?width=500&fit=cover",
    "questionTypes": [
      "Matching Information",
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "Actual Tests",
    "durationMinutes": 20
  },
  {
    "id": "r-19",
    "title": "[YouPass Collect] - The Ant and the Mandarin",
    "skill": "reading",
    "passage": "Passage 2",
    "views": "15914 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/48be1e94-9ae3-40ec-b064-3b9e8b65d7e1?width=500&fit=cover",
    "questionTypes": [
      "Matching Information",
      "True - False - Not Given"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "r-20",
    "title": "[Simulation Q3] The myth of multitasking",
    "skill": "reading",
    "passage": "Passage 3",
    "views": "3512 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/b12b850e-4ecf-404b-bb72-bf7e598069e8?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Multiple Choice (One Answer)",
      "Yes - No - Not Given"
    ],
    "source": "YouPass Simulation",
    "durationMinutes": 20
  }
];

export const youpassListeningCatalog: YouPassTestItem[] = [
  {
    "id": "l-1",
    "title": "[YouPass Collect] - Section 1: Hollowmere Home Library Service",
    "skill": "listening",
    "part": "Section 1",
    "views": "2386 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/03cb9744-3170-4e95-a00b-49b444cfc9fc?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-2",
    "title": "[YouPass Collect] - Section 2: Whitegull Sands Holiday Park",
    "skill": "listening",
    "part": "Section 2",
    "views": "1037 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/5f2544c9-1b53-4c49-802e-8d6b4e3db1e7?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-3",
    "title": "[YouPass Collect] - Section 3: Archaeology field school at Hollin Ridge",
    "skill": "listening",
    "part": "Section 3",
    "views": "608 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/4ac1cb5d-ceaa-4ddc-872f-78841485991c?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-4",
    "title": "[YouPass Collect] - Section 4: The return of vinyl records",
    "skill": "listening",
    "part": "Section 4",
    "views": "594 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/72cbe277-3c16-4994-a793-9473ab6e20d0?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-5",
    "title": "[YouPass Collect] - Section 1: Beginner bookbinding courses",
    "skill": "listening",
    "part": "Section 1",
    "views": "31696 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/27efa35d-7b44-4917-8649-8e3ad08b8c33?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-6",
    "title": "[YouPass Collect] - Section 2: Fenbridge Community Archive",
    "skill": "listening",
    "part": "Section 2",
    "views": "16754 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/d3a05a03-d9a1-41f3-92b5-3657fdb9db05?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-7",
    "title": "[YouPass Collect] - Section 3: Campus water refill project",
    "skill": "listening",
    "part": "Section 3",
    "views": "12290 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/7b4f0778-21c6-4e57-870f-938d804789b2?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-8",
    "title": "[YouPass Collect] - Section 4: Braille: from raised dots to writing machines",
    "skill": "listening",
    "part": "Section 4",
    "views": "10449 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/a687cbe9-f836-461b-a8d3-755c1c461797?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-9",
    "title": "[YouPass Collect] - Section 1: Fairmead online delivery – customer survey",
    "skill": "listening",
    "part": "Section 1",
    "views": "18316 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/988e0229-d76e-4486-b089-392502849569?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-10",
    "title": "[YouPass Collect] - Section 2: Brindlemere Repair Cafe",
    "skill": "listening",
    "part": "Section 2",
    "views": "8071 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/21bbe296-74ed-4da2-b57c-213f0fa8a67e?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-11",
    "title": "[YouPass Collect] - Section 3: School Street project",
    "skill": "listening",
    "part": "Section 3",
    "views": "6901 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/774bad6b-754a-4426-b44e-ff55b6d30118?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (One Answer)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-12",
    "title": "[YouPass Collect] - Section 4: The history of lighthouses in Britain",
    "skill": "listening",
    "part": "Section 4",
    "views": "6561 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/3303f38f-8357-4c42-862c-c323729c9634?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-13",
    "title": "[Actual Test] - Get Away Tours",
    "skill": "listening",
    "part": "Section 1",
    "views": "47821 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/3688b662-b7b1-4912-828c-28ce5176234d?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "Actual Tests",
    "durationMinutes": 10
  },
  {
    "id": "l-14",
    "title": "[Actual Test] - Volunteer work application",
    "skill": "listening",
    "part": "Section 1",
    "views": "40306 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/18acf8c9-5f53-42dc-8f32-a70c49d2aade?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "Actual Tests",
    "durationMinutes": 10
  },
  {
    "id": "l-15",
    "title": "[YouPass Collect] - Accommodation Agency",
    "skill": "listening",
    "part": "Section 2",
    "views": "52382 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/4153732a-5887-4aea-9024-b635374fae00?width=500&fit=cover",
    "questionTypes": [
      "Map, Diagram Label"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-16",
    "title": "[YouPass Collect] - Effects of Music on Consumer Behaviour",
    "skill": "listening",
    "part": "Section 3",
    "views": "28560 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/d500acef-bac3-4a3b-8f49-ba14bb3740e9?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling",
      "Multiple Choice (Many Answers)",
      "Multiple Choice (One Answer)"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-17",
    "title": "[Actual Test] - Willow's furniture company",
    "skill": "listening",
    "part": "Section 3",
    "views": "13638 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/e4d15f49-fef0-4cb9-a64c-47187b4c563f?width=500&fit=cover",
    "questionTypes": [
      "Multiple Choice (Many Answers)",
      "Multiple Choice (One Answer)"
    ],
    "source": "Actual Tests",
    "durationMinutes": 10
  },
  {
    "id": "l-18",
    "title": "[YouPass Collect]- Office Design",
    "skill": "listening",
    "part": "Section 4",
    "views": "16176 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/f126dd85-0fef-4402-8937-1662c5b642d5?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 10
  },
  {
    "id": "l-19",
    "title": "[Actual Test] - Presentation on A Bee Disease",
    "skill": "listening",
    "part": "Section 4",
    "views": "9178 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/08142165-c0e9-40d7-b12f-b49177e1420b?width=500&fit=cover",
    "questionTypes": [
      "Gap Filling"
    ],
    "source": "Actual Tests",
    "durationMinutes": 10
  },
  {
    "id": "l-20",
    "title": "[Actual Test] - Report on Bicycle Theft",
    "skill": "listening",
    "part": "Section 3",
    "views": "7433 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/12adc020-ec7c-4234-aec6-704dad1cfbe2?width=500&fit=cover",
    "questionTypes": [
      "Matching Information",
      "Multiple Choice (Many Answers)"
    ],
    "source": "Actual Tests",
    "durationMinutes": 10
  }
];

export const youpassWritingCatalog: YouPassTestItem[] = [
  {
    "id": "w-1",
    "title": "[YouPass Collect] - College Building Renovation Plans",
    "skill": "writing",
    "task": "Task 1",
    "views": "8,920 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/13363f15-3501-4765-9f8b-8ac0d3b65d42?width=300&fit=cover",
    "questionTypes": [
      "Map",
      "Building Plans"
    ],
    "source": "YouPass Collect",
    "durationMinutes": 20
  },
  {
    "id": "w-2",
    "title": "Process - Milk Production and Dairy Factory Cycle",
    "skill": "writing",
    "task": "Task 1",
    "views": "15,420 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/5050117c-9e79-4b73-9719-adb0c7239add?width=300&fit=cover",
    "questionTypes": [
      "Process Diagram"
    ],
    "source": "Actual Tests",
    "durationMinutes": 20
  },
  {
    "id": "w-3",
    "title": "Line Graph - Car Thefts and Crime Statistics in Great Britain",
    "skill": "writing",
    "task": "Task 1",
    "views": "22,100 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/9fc86213-8cd2-4fbd-a1c8-5ed196450aec?width=300&fit=cover",
    "questionTypes": [
      "Line Graph"
    ],
    "source": "C10-C20",
    "durationMinutes": 20
  },
  {
    "id": "w-4",
    "title": "Table - Underground Railway Systems in Six Major Cities",
    "skill": "writing",
    "task": "Task 1",
    "views": "18,340 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/4545ed4b-e778-497e-88fd-8bfa7a501dfc?width=300&fit=cover",
    "questionTypes": [
      "Table"
    ],
    "source": "C10-C20",
    "durationMinutes": 20
  },
  {
    "id": "w-5",
    "title": "Writing Task 2: Some people think that universities should provide graduates with knowledge and skills needed in the workplace...",
    "skill": "writing",
    "task": "Task 2",
    "views": "34,900 lượt làm bài",
    "img": "https://cms.youpass.vn/assets/889f1750-27ff-4660-b584-d652823ec96f?width=300&fit=cover",
    "questionTypes": [
      "Discussion Essay",
      "Opinion Essay"
    ],
    "source": "YouPass Simulation",
    "durationMinutes": 40
  }
];

// =========================================================================
// AUTHENTIC PLAYABLE TEST: [YouPass Collect] How popcorn came to the cinema
// =========================================================================
export const youpassPopcornExam: IELTSExam = {
  id: 'youpass-popcorn',
  title: '[YouPass Collect] - How popcorn came to the cinema',
  category: 'Academic',
  module: 'reading',
  durationMinutes: 20,
  parts: [
    {
      partNumber: 1,
      title: 'Reading Passage 1',
      passage: {
        id: 'passage-popcorn',
        title: 'How popcorn came to the cinema',
        paragraphs: [
          {
            id: 'p1',
            label: '1',
            text: 'Popcorn has a long history that predates modern cinema by thousands of years. Archaeological evidence indicates that indigenous peoples in Mesoamerica were cultivating and popping corn as early as 4000 BC. Unlike sweet corn, which has soft kernels that collapse when heated, popping corn possesses a hard, moisture-sealed hull surrounding a dense pocket of starch. When subjected to intense heat, the water inside converts to steam, building pressure until the hull abruptly ruptures, turning the kernel inside out into a fluffy white puff.'
          },
          {
            id: 'p2',
            label: '2',
            text: 'By the mid-nineteenth century, popcorn had become a popular street food across the United States. Its popularity surged with the invention of the mobile steam-powered popcorn popper by Charles Cretors in 1885. This ingenious invention allowed street vendors to roast nuts and pop corn simultaneously while pushing their carts through crowded city streets, carnivals, and outside theaters. The aroma of freshly popped corn was irresistible to passersby, and the snack was affordable, costing just five to ten cents a bag.'
          },
          {
            id: 'p3',
            label: '3',
            text: 'However, early movie theaters—known as nickelodeons—actively banned popcorn from their premises. These early establishments sought to attract an affluent clientele and modeled their interiors after traditional live-performance theaters, complete with expensive carpets, plush velvet seating, and ornate draperies. Theater owners feared that patrons crunching on snacks would create a noisy distraction and that spilled popcorn would permanently ruin their luxurious furnishings. Moreover, silent films required audiences to read subtitles, and theater owners argued that eating would disrupt the concentration needed to follow the plot.'
          },
          {
            id: 'p4',
            label: '4',
            text: 'The arrival of sound films in 1927, known as the "talkies", transformed the cinema experience and broadened movie audiences to include all social classes. Literacy was no longer a prerequisite for enjoying films, and auditory distractions were easily masked by the spoken dialogue and orchestral soundtracks. Outside theaters, independent street vendors did brisk business selling popcorn to moviegoers, who would covertly smuggle the warm bags inside under their coats.'
          },
          {
            id: 'p5',
            label: '5',
            text: 'It took the economic devastation of the Great Depression in 1929 for theater operators to recognize the lucrative potential of selling popcorn directly inside their lobbies. Facing plummeting ticket sales and bankruptcy, cinemas that installed concession stands selling popcorn and candy survived the economic crisis, whereas those refusing to adapt were forced to close their doors. Theater owners quickly realized that profit margins on popcorn were extraordinarily high—often exceeding 80 percent—because corn kernels and cooking oil were remarkably cheap.'
          },
          {
            id: 'p6',
            label: '6',
            text: 'During World War II, a severe sugar rationing depleted candy supplies and soda syrup across North America. Popcorn, which required salt and oil rather than sugar, filled the culinary void. By the war\'s end in 1945, popcorn had become inextricably tied to the cinema experience, cementing a cultural and commercial partnership that continues to generate billions in revenue for movie chains today.'
          }
        ]
      },
      questions: [
        {
          id: 'pop-q1',
          number: 1,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'The kernel explodes because the water inside turns into (1)... under intense heat.',
          correctAnswer: 'steam',
          explanation: 'Đoạn 1 chỉ ra rõ: When subjected to intense heat, the water inside converts to steam, building pressure until the hull ruptures.',
          evidenceSentence: 'When subjected to intense heat, the water inside converts to steam...',
          evidenceSentenceId: 'p1'
        },
        {
          id: 'pop-q2',
          number: 2,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'The mobile popper created by Charles Cretors in 1885 was powered by (2)...',
          correctAnswer: 'steam',
          explanation: 'Đoạn 2: ...invention of the mobile steam-powered popcorn popper by Charles Cretors in 1885.',
          evidenceSentence: 'Surged with the invention of the mobile steam-powered popcorn popper by Charles Cretors in 1885.',
          evidenceSentenceId: 'p2'
        },
        {
          id: 'pop-q3',
          number: 3,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Early nickelodeons wanted to appeal to an (3)... clientele.',
          correctAnswer: 'affluent',
          explanation: 'Đoạn 3: These early establishments sought to attract an affluent clientele...',
          evidenceSentence: 'These early establishments sought to attract an affluent clientele...',
          evidenceSentenceId: 'p3'
        },
        {
          id: 'pop-q4',
          number: 4,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Owners were concerned that dropped popcorn would damage their expensive (4)...',
          correctAnswer: 'carpets',
          explanation: 'Đoạn 3 đề cập: expensive carpets, plush velvet seating... and that spilled popcorn would permanently ruin their luxurious furnishings.',
          evidenceSentence: 'theater owners feared that patrons crunching on snacks would create a noisy distraction and that spilled popcorn would permanently ruin their luxurious furnishings.',
          evidenceSentenceId: 'p3'
        },
        {
          id: 'pop-q5',
          number: 5,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Sound films introduced in 1927 were nicknamed (5)...',
          correctAnswer: 'talkies',
          explanation: 'Đoạn 4: The arrival of sound films in 1927, known as the "talkies", transformed the cinema experience...',
          evidenceSentence: 'The arrival of sound films in 1927, known as the "talkies", transformed the cinema experience...',
          evidenceSentenceId: 'p4'
        },
        {
          id: 'pop-q6',
          number: 6,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Popcorn margins frequently exceeded (6)... percent.',
          correctAnswer: '80',
          explanation: 'Đoạn 5: ...profit margins on popcorn were extraordinarily high—often exceeding 80 percent...',
          evidenceSentence: 'Theater owners quickly realized that profit margins on popcorn were extraordinarily high—often exceeding 80 percent...',
          evidenceSentenceId: 'p5'
        },
        {
          id: 'pop-q7',
          number: 7,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'During World War II, a rationing of (7)... limited the availability of candy.',
          correctAnswer: 'sugar',
          explanation: 'Đoạn 6: During World War II, a severe sugar rationing depleted candy supplies...',
          evidenceSentence: 'During World War II, a severe sugar rationing depleted candy supplies and soda syrup...',
          evidenceSentenceId: 'p6'
        },
        {
          id: 'pop-q8',
          number: 8,
          type: 'true_false_not_given',
          part: 1,
          prompt: 'Sweet corn kernels pop in the same way as popping corn when heated.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'FALSE',
          explanation: 'Đoạn 1 nêu: "Unlike sweet corn, which has soft kernels that collapse when heated, popping corn possesses a hard, moisture-sealed hull..." -> Ngược lại với sweet corn nên đáp án là FALSE.',
          evidenceSentence: 'Unlike sweet corn, which has soft kernels that collapse when heated, popping corn possesses a hard, moisture-sealed hull...',
          evidenceSentenceId: 'p1'
        },
        {
          id: 'pop-q9',
          number: 9,
          type: 'true_false_not_given',
          part: 1,
          prompt: 'Charles Cretors made a substantial personal fortune from his popcorn machine patent.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'NOT GIVEN',
          explanation: 'Bài đọc chỉ nói Charles Cretors phát minh ra mobile steam-powered popper năm 1885, hoàn toàn không nhắc đến việc ông có kiếm được gia tài cá nhân lớn hay không.',
          evidenceSentence: 'Its popularity surged with the invention of the mobile steam-powered popcorn popper by Charles Cretors in 1885.',
          evidenceSentenceId: 'p2'
        },
        {
          id: 'pop-q10',
          number: 10,
          type: 'true_false_not_given',
          part: 1,
          prompt: 'Silent film viewers sometimes smuggled popcorn into theaters despite rules against it.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'TRUE',
          explanation: 'Đoạn 4 nói rõ: "...moviegoers, who would covertly smuggle the warm bags inside under their coats." -> TRUE.',
          evidenceSentence: '...moviegoers, who would covertly smuggle the warm bags inside under their coats.',
          evidenceSentenceId: 'p4'
        },
        {
          id: 'pop-q11',
          number: 11,
          type: 'true_false_not_given',
          part: 1,
          prompt: 'All movie theaters that refused to install popcorn stands during the Depression went bankrupt.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'TRUE',
          explanation: 'Đoạn 5 khẳng định: "...whereas those refusing to adapt were forced to close their doors." -> TRUE.',
          evidenceSentence: '...whereas those refusing to adapt were forced to close their doors.',
          evidenceSentenceId: 'p5'
        },
        {
          id: 'pop-q12',
          number: 12,
          type: 'true_false_not_given',
          part: 1,
          prompt: 'Popcorn was rationed by the United States government during World War II.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'FALSE',
          explanation: 'Đoạn 6 nêu sugar bị rationed, còn popcorn không cần đường mà dùng muối và dầu nên đã lấp đầy khoảng trống ẩm thực: "Popcorn, which required salt and oil rather than sugar, filled the culinary void." -> FALSE.',
          evidenceSentence: 'Popcorn, which required salt and oil rather than sugar, filled the culinary void.',
          evidenceSentenceId: 'p6'
        },
        {
          id: 'pop-q13',
          number: 13,
          type: 'true_false_not_given',
          part: 1,
          prompt: 'Modern cinemas make more money from ticket sales than from popcorn and concessions.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'NOT GIVEN',
          explanation: 'Đoạn 6 chỉ nói popcorn tiếp tục đem lại hàng tỷ đô doanh thu cho các chuỗi rạp chiếu phim, không so sánh tỷ lệ giữa doanh thu vé và doanh thu bắp rang hiện đại.',
          evidenceSentence: '...cementing a cultural and commercial partnership that continues to generate billions in revenue for movie chains today.',
          evidenceSentenceId: 'p6'
        }
      ]
    }
  ]
};

// =========================================================================
// AUTHENTIC PLAYABLE TEST: [Simulation Q4] Predicting our future happiness
// =========================================================================
export const youpassHappinessExam: IELTSExam = {
  id: 'youpass-happiness',
  title: '[Simulation Q4] Predicting our future happiness',
  category: 'Academic',
  module: 'reading',
  durationMinutes: 20,
  parts: [
    {
      partNumber: 1,
      title: 'Reading Passage 3',
      passage: {
        id: 'passage-happiness',
        title: 'Predicting our future happiness',
        paragraphs: [
          {
            id: 'hp1',
            label: 'A',
            text: 'Human beings have the remarkable ability to project themselves into the future and imagine scenarios that have not yet occurred. However, psychological research demonstrates that we are notoriously poor at affective forecasting—the prediction of how we will feel in response to future events. We consistently overestimate the intensity and duration of both our positive emotions after a windfall and our negative reactions to catastrophe, a systematic bias known as impact bias.'
          },
          {
            id: 'hp2',
            label: 'B',
            text: 'One primary explanation for this cognitive error is focalism, also termed the focusing illusion. When asked how an event will affect our happiness, we focus intently on the occurrence in question—such as securing a dream promotion or suffering a debilitating injury—while neglecting all the other life events that will continue to occur simultaneously. We fail to recognize that daily mundane experiences, such as having a good meal or being stuck in traffic, will continue to exert a powerful pull on our emotional state.'
          },
          {
            id: 'hp3',
            label: 'C',
            text: 'Another critical factor is our failure to anticipate psychological immune defense mechanisms. Just as the biological immune system protects the physical body against illness, our psychological immune system works subconsciously to rationalize setbacks and reframe negative occurrences in a more favorable light. Consequently, major disappointments rarely crush us for as long as we initially dread.'
          }
        ]
      },
      questions: [
        {
          id: 'hap-q27',
          number: 27,
          type: 'multiple_choice',
          part: 1,
          prompt: 'What is affective forecasting according to Paragraph A?',
          options: [
            { label: 'A', text: 'Planning future financial expenditures' },
            { label: 'B', text: 'Predicting emotional reactions to future events' },
            { label: 'C', text: 'Remembering emotional states from childhood' },
            { label: 'D', text: 'Choosing the happiest career path' },
          ],
          correctAnswer: 'B',
          explanation: 'Đoạn A: ...affective forecasting—the prediction of how we will feel in response to future events.',
          evidenceSentence: '...affective forecasting—the prediction of how we will feel in response to future events.',
          evidenceSentenceId: 'hp1'
        },
        {
          id: 'hap-q28',
          number: 28,
          type: 'multiple_choice',
          part: 1,
          prompt: 'Focalism causes people to',
          options: [
            { label: 'A', text: 'ignore routine everyday occurrences when forecasting their feelings.' },
            { label: 'B', text: 'avoid taking risks in professional settings.' },
            { label: 'C', text: 'place too much importance on physical health.' },
            { label: 'D', text: 'distrust advice given by friends.' },
          ],
          correctAnswer: 'A',
          explanation: 'Đoạn B: while neglecting all the other life events that will continue to occur simultaneously. We fail to recognize that daily mundane experiences... will continue to exert a powerful pull.',
          evidenceSentence: '...while neglecting all the other life events that will continue to occur simultaneously.',
          evidenceSentenceId: 'hp2'
        },
        {
          id: 'hap-q29',
          number: 29,
          type: 'yes_no_not_given',
          part: 1,
          prompt: 'People usually overestimate how devastated they will be following a disaster.',
          options: [
            { label: 'YES', text: 'YES' },
            { label: 'NO', text: 'NO' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'YES',
          explanation: 'Đoạn A: We consistently overestimate the intensity and duration of both our positive emotions after a windfall and our negative reactions to catastrophe...',
          evidenceSentence: 'We consistently overestimate the intensity and duration of both our positive emotions after a windfall and our negative reactions to catastrophe...',
          evidenceSentenceId: 'hp1'
        },
        {
          id: 'hap-q30',
          number: 30,
          type: 'yes_no_not_given',
          part: 1,
          prompt: 'The psychological immune system functions largely beneath our conscious awareness.',
          options: [
            { label: 'YES', text: 'YES' },
            { label: 'NO', text: 'NO' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          correctAnswer: 'YES',
          explanation: 'Đoạn C: ...our psychological immune system works subconsciously to rationalize setbacks...',
          evidenceSentence: '...our psychological immune system works subconsciously to rationalize setbacks...',
          evidenceSentenceId: 'hp3'
        }
      ]
    }
  ]
};

// =========================================================================
// AUTHENTIC PLAYABLE TEST: [YouPass Collect] Section 1: Hollowmere Home Library
// =========================================================================
export const youpassHollowmereExam: IELTSExam = {
  id: 'youpass-hollowmere',
  title: '[YouPass Collect] - Section 1: Hollowmere Home Library Service',
  category: 'Academic',
  module: 'listening',
  durationMinutes: 10,
  parts: [
    {
      partNumber: 1,
      title: 'Listening Section 1',
      audioUrl: 'https://ia800204.us.archive.org/11/items/ielts_listening_sample_01/section1_sample.mp3',
      questions: [
        {
          id: 'hol-q1',
          number: 1,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Eligibility: Customers must live within (1)... miles of the town center.',
          correctAnswer: '5',
          explanation: 'Trong băng ghi âm, nhân viên thông báo dịch vụ giao sách tận nhà miễn phí áp dụng cho cư dân trong phạm vi 5 dặm (5 miles).',
          evidenceSentence: 'You need to be a resident living within five miles of our central library.'
        },
        {
          id: 'hol-q2',
          number: 2,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Delivery schedule: Books are delivered every second (2)...',
          correctAnswer: 'Thursday',
          explanation: 'Thủ thư xác nhận lịch giao sách định kỳ diễn ra vào thứ Năm cách tuần (every second Thursday).',
          evidenceSentence: 'Our volunteers do the delivery run every second Thursday morning.'
        },
        {
          id: 'hol-q3',
          number: 3,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Maximum items borrowed per visit: (3)... books or audiobooks.',
          correctAnswer: '12',
          explanation: 'Mỗi độc giả được mượn tối đa 12 đầu sách hoặc sách nói.',
          evidenceSentence: 'You are allowed up to 12 items at any one time.'
        },
        {
          id: 'hol-q4',
          number: 4,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Preferred genre: Client requested historical (4)... novels.',
          correctAnswer: 'fiction',
          explanation: 'Độc giả yêu cầu thể loại tiểu thuyết lịch sử hư cấu (historical fiction novels).',
          evidenceSentence: 'I am especially keen on historical fiction.'
        },
        {
          id: 'hol-q5',
          number: 5,
          type: 'fill_in_blanks',
          part: 1,
          prompt: 'Contact number: 07700 (5)...',
          correctAnswer: '900452',
          explanation: 'Dãy số điện thoại người đăng ký đọc trong cuộc hội thoại: 07700 900452.',
          evidenceSentence: 'My mobile number is 07700 900452.'
        }
      ]
    }
  ]
};

export const getYouPassExamById = (idOrTitle: string): IELTSExam => {
  const norm = idOrTitle.toLowerCase();
  if (norm.includes('popcorn')) return youpassPopcornExam;
  if (norm.includes('happiness')) return youpassHappinessExam;
  if (norm.includes('hollowmere')) return youpassHollowmereExam;
  return youpassLegoExam;
};
