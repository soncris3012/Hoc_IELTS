import { NextRequest, NextResponse } from 'next/server';
import initialCacheData from '@/data/youpassInitialCache.json';

const API_BASE = 'https://api.youpass.vn/v1/public';

// Typed wrapper over server-side offline cache
interface InitialCacheShape {
  totals: Record<string, number>;
  tagPositions: unknown[];
  lists: Record<string, unknown>;
  quizzes: Record<string, unknown>;
}

const initialCache = initialCacheData as unknown as InitialCacheShape;

async function fetchUpstream(url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'HocIELTS-YouPass-Mirror/1.0',
    },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(9000),
  });
  if (!res.ok) {
    throw new Error(`Upstream HTTP ${res.status}`);
  }
  const json = await res.json();
  return json?.data ?? json;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get('action') || 'list';

  try {
    if (action === 'tags') {
      try {
        const data = await fetchUpstream(`${API_BASE}/tag-positions`);
        return NextResponse.json({ success: true, data, totals: initialCache.totals });
      } catch {
        return NextResponse.json({
          success: true,
          cached: true,
          data: initialCache.tagPositions,
          totals: initialCache.totals,
        });
      }
    }

    if (action === 'quiz') {
      const id = searchParams.get('id');
      if (!id || !/^\d+$/.test(id)) {
        return NextResponse.json({ success: false, error: 'Missing or invalid quiz id' }, { status: 400 });
      }
      // Fast-path cached featured quizzes unless ?fresh=1
      if (searchParams.get('fresh') !== '1' && initialCache.quizzes[id]) {
        return NextResponse.json({ success: true, cached: true, data: initialCache.quizzes[id] });
      }
      try {
        const data = await fetchUpstream(`${API_BASE}/quizzes/${id}/true/null`);
        return NextResponse.json({ success: true, data });
      } catch (err) {
        if (initialCache.quizzes[id]) {
          return NextResponse.json({ success: true, cached: true, data: initialCache.quizzes[id] });
        }
        throw err;
      }
    }

    if (action === 'mock-list') {
      const skill = searchParams.get('skill') === '2' ? '2' : '1';
      const page = Math.max(1, Number(searchParams.get('page') || 1));
      const cacheKey = skill === '2' ? `mock_listening_${page}` : `mock_reading_${page}`;
      try {
        const data = await fetchUpstream(`${API_BASE}/mock-test/4/${page}/${skill}/priority.desc`);
        return NextResponse.json({ success: true, data });
      } catch (err) {
        if (initialCache.lists[cacheKey]) {
          return NextResponse.json({ success: true, cached: true, data: initialCache.lists[cacheKey] });
        }
        throw err;
      }
    }

    if (action === 'mock-detail') {
      const id = searchParams.get('id');
      if (!id || !/^\d+$/.test(id)) {
        return NextResponse.json({ success: false, error: 'Missing or invalid mock test id' }, { status: 400 });
      }
      const data = await fetchUpstream(`${API_BASE}/mock-test/detail/${id}`);
      return NextResponse.json({ success: true, data });
    }

    if (action === 'speaking') {
      const part = ['1', '2', '3'].includes(searchParams.get('part') || '')
        ? searchParams.get('part')!
        : '1';
      const page = Math.max(1, Number(searchParams.get('page') || 1));
      const bookType = searchParams.get('bookType') || 'null';
      const search = (searchParams.get('search') || '').trim();
      const cacheKey = `speaking_${part}_${page}`;

      try {
        let url: string;
        if (search) {
          const qs = new URLSearchParams({
            page_size: '20',
            page: String(page),
            status: 'published',
            speaking_part_type: part,
            search,
            mode: '0',
          });
          if (bookType !== 'null') qs.set('tag_book_type', bookType);
          url = `${API_BASE}/speaking-topics?${qs.toString()}`;
        } else {
          url = `${API_BASE}/speaking-topics/list/20/${part}/${encodeURIComponent(bookType)}/${page}`;
        }
        const data = await fetchUpstream(url);
        return NextResponse.json({ success: true, data });
      } catch (err) {
        if (!search && bookType === 'null' && initialCache.lists[cacheKey]) {
          return NextResponse.json({ success: true, cached: true, data: initialCache.lists[cacheKey] });
        }
        throw err;
      }
    }

    // Default action === 'list' (Reading / Listening / Writing)
    const skill = searchParams.get('skill') || 'reading';
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const part = searchParams.get('part') || 'null';
    const qType = searchParams.get('qType') || 'null';
    const bookType = searchParams.get('bookType') || 'null';
    const topic = searchParams.get('topic') || 'null';
    const search = (searchParams.get('search') || '').trim();

    const typeCodes: Record<string, string> = {
      reading: '1,9',
      listening: '2,10',
      writing: '7',
    };
    const typesParam = typeCodes[skill] || '1,9';

    // Determine cache key for first page unfiltered views
    let cacheKey: string | null = null;
    if (!search && page === 1 && qType === 'null' && bookType === 'null' && topic === 'null') {
      if (skill === 'reading' && part === 'null') cacheKey = 'reading_1';
      else if (skill === 'listening' && part === 'null') cacheKey = 'listening_1';
      else if (skill === 'writing') {
        cacheKey = part === '1' ? 'writing_1_1' : part === '2' ? 'writing_2_1' : 'writing_all_1';
      }
    }

    try {
      let url: string;
      if (search) {
        const qs = new URLSearchParams({
          page_size: '20',
          page: String(page),
          status: 'published',
          is_test: 'true',
          quiz_types: '3',
          search,
          mode: '0',
        });
        if (skill === 'reading') {
          qs.append('types', '1');
          qs.append('types', '9');
          if (part !== 'null') qs.set('tag_passage', part);
        } else if (skill === 'listening') {
          qs.append('types', '2');
          qs.append('types', '10');
          if (part !== 'null') qs.set('tag_section', part);
        } else {
          qs.append('types', '7');
          if (part !== 'null') qs.set('writing_task_type', part);
        }
        if (qType !== 'null') qs.set('tag_question_type', qType);
        if (bookType !== 'null') qs.set('tag_book_type', bookType);
        if (topic !== 'null') qs.set('tag_topic', topic);
        url = `${API_BASE}/quizzes?${qs.toString()}`;
      } else {
        url = `${API_BASE}/quizzes/list/${typesParam}/3/${page}/true/${encodeURIComponent(
          part
        )}/${encodeURIComponent(qType)}/${encodeURIComponent(bookType)}/${encodeURIComponent(topic)}`;
      }

      const data = await fetchUpstream(url);
      return NextResponse.json({ success: true, data });
    } catch (err) {
      if (cacheKey && initialCache.lists[cacheKey]) {
        return NextResponse.json({ success: true, cached: true, data: initialCache.lists[cacheKey] });
      }
      throw err;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error fetching YouPass API';
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
