const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            Accept: 'application/json',
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(new Error(`Invalid JSON from ${url}: ${err.message}`));
            }
          });
        }
      )
      .on('error', reject);
  });
}

async function safeFetch(url) {
  try {
    const res = await fetchJson(url);
    return res?.data ?? res;
  } catch (err) {
    console.warn('Warning fetching', url, err.message);
    return null;
  }
}

async function main() {
  console.log('Starting YouPass live data scrape...');

  const [
    readingList,
    listeningList,
    writingAllList,
    writingT1List,
    writingT2List,
    mockReadingList,
    mockListeningList,
    speakingP1List,
    speakingP2List,
    speakingP3List,
    tagPositions,
  ] = await Promise.all([
    safeFetch('https://api.youpass.vn/v1/public/quizzes/list/1,9/3/1/true/null/null/null/null'),
    safeFetch('https://api.youpass.vn/v1/public/quizzes/list/2,10/3/1/true/null/null/null/null'),
    safeFetch('https://api.youpass.vn/v1/public/quizzes/list/7/3/1/true/null/null/null/null'),
    safeFetch('https://api.youpass.vn/v1/public/quizzes/list/7/3/1/true/1/null/null/null'),
    safeFetch('https://api.youpass.vn/v1/public/quizzes/list/7/3/1/true/2/null/null/null'),
    safeFetch('https://api.youpass.vn/v1/public/mock-test/4/1/1/priority.desc'),
    safeFetch('https://api.youpass.vn/v1/public/mock-test/4/1/2/priority.desc'),
    safeFetch('https://api.youpass.vn/v1/public/speaking-topics/list/20/1/null/1'),
    safeFetch('https://api.youpass.vn/v1/public/speaking-topics/list/20/2/null/1'),
    safeFetch('https://api.youpass.vn/v1/public/speaking-topics/list/20/3/null/1'),
    safeFetch('https://api.youpass.vn/v1/public/tag-positions'),
  ]);

  // Select representative quizzes across Reading, Listening, Writing, Full Mock, Speaking
  const quizIdsToCache = new Set([
    13858, // [Simulation Q4] The Lego brick
    13860, // [Simulation Q4] Predicting our future happiness
    13794, // [YouPass Collect] - The Power of Strangers
    13792, // [YouPass Collect] - The rise of short-sightedness
    13908, // Full Reading Mock Test (3 passages, 40 questions)
    13870, // Listening Section 1 Hollowmere
    13872, // Listening Section 2 Whitegull
    11896, // Listening Map Accommodation Agency
    13847, // Writing Task 1 Coal mine redevelopment
    10294, // Writing Task 2 Technology's Impact
  ]);

  // Also cache top 4 reading, top 3 listening, top 2 writing
  (readingList?.items || []).slice(0, 4).forEach((q) => quizIdsToCache.add(q.id));
  (listeningList?.items || []).slice(0, 3).forEach((q) => quizIdsToCache.add(q.id));
  (writingT1List?.items || []).slice(0, 2).forEach((q) => quizIdsToCache.add(q.id));
  (writingT2List?.items || []).slice(0, 2).forEach((q) => quizIdsToCache.add(q.id));
  if (speakingP1List?.topics?.[0]?.quizzes?.[0]?.id) {
    quizIdsToCache.add(speakingP1List.topics[0].quizzes[0].id);
  }

  console.log(`Fetching detailed data for ${quizIdsToCache.size} quizzes...`);
  const quizzes = {};
  const ids = Array.from(quizIdsToCache);
  for (let i = 0; i < ids.length; i += 5) {
    const batch = ids.slice(i, i + 5);
    const results = await Promise.all(
      batch.map((id) => safeFetch(`https://api.youpass.vn/v1/public/quizzes/${id}/true/null`))
    );
    batch.forEach((id, idx) => {
      if (results[idx]) {
        quizzes[String(id)] = results[idx];
      }
    });
  }

  const cachePayload = {
    generatedAt: new Date().toISOString(),
    totals: {
      reading: readingList?.total || 0,
      listening: listeningList?.total || 0,
      writingAll: writingAllList?.total || 0,
      writingTask1: writingT1List?.total || 0,
      writingTask2: writingT2List?.total || 0,
      speakingPart1: speakingP1List?.total || 0,
      speakingPart2: speakingP2List?.total || 0,
      speakingPart3: speakingP3List?.total || 0,
      mockReading: mockReadingList?.total || 0,
      mockListening: mockListeningList?.total || 0,
    },
    tagPositions: tagPositions || [],
    lists: {
      reading_1: readingList,
      listening_1: listeningList,
      writing_all_1: writingAllList,
      writing_1_1: writingT1List,
      writing_2_1: writingT2List,
      mock_reading_1: mockReadingList,
      mock_listening_1: mockListeningList,
      speaking_1_1: speakingP1List,
      speaking_2_1: speakingP2List,
      speaking_3_1: speakingP3List,
    },
    quizzes,
  };

  const outPath = path.join(__dirname, '..', 'src', 'data', 'youpassInitialCache.json');
  fs.writeFileSync(outPath, JSON.stringify(cachePayload, null, 2));
  const stats = fs.statSync(outPath);
  console.log(`Done! Saved ${(stats.size / 1024).toFixed(1)} KB to ${outPath}`);
  console.log('Cached quiz count:', Object.keys(quizzes).length);
  console.log('Totals:', cachePayload.totals);
}

main().catch((err) => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
