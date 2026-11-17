'use client';

import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, MapPin, Sparkles, X } from 'lucide-react';
import {
  YouPassLocateInfo,
  YouPassQuestion,
  YouPassQuestionSet,
} from '@/types/youpass';
import {
  evaluateQuestionSlot,
  expandQuestionSetSlots,
  sanitizeYouPassHtml,
} from '@/lib/youpassHelpers';

interface YouPassQuestionSetRendererProps {
  questionSet: YouPassQuestionSet;
  answers: Record<number, string | string[]>;
  onAnswerChange: (questionOrder: number, value: string) => void;
  onMultiAnswerChange: (orders: number[], selectedValues: string[]) => void;
  selectedHeading: { option: string; text: string } | null;
  onSelectHeading: (heading: { option: string; text: string } | null) => void;
  isSubmitted: boolean;
  activeQuestionOrder: number;
  onFocusQuestion: (order: number) => void;
  onLocateEvidence?: (order: number, locate?: YouPassLocateInfo | null) => void;
}

export const YouPassQuestionSetRenderer: React.FC<YouPassQuestionSetRendererProps> = ({
  questionSet,
  answers,
  onAnswerChange,
  onMultiAnswerChange,
  selectedHeading,
  onSelectHeading,
  isSubmitted,
  activeQuestionOrder,
  onFocusQuestion,
  onLocateEvidence,
}) => {
  const [expandedExplains, setExpandedExplains] = useState<Record<number, boolean>>({});
  const slots = useMemo(() => expandQuestionSetSlots(questionSet), [questionSet]);

  const toggleExplain = (order: number) => {
    setExpandedExplains((prev) => ({ ...prev, [order]: !prev[order] }));
  };

  // Map order -> YouPassQuestion for fast lookup during HTML gap replacement
  const questionByOrder = useMemo(() => {
    const map = new Map<number, YouPassQuestion>();
    (questionSet.questions || []).forEach((q) => {
      map.set(q.order, q);
    });
    return map;
  }, [questionSet.questions]);

  const renderInlineControl = (qOrder: number, key: string) => {
    const q = questionByOrder.get(qOrder);
    const val = typeof answers[qOrder] === 'string' ? (answers[qOrder] as string) : '';
    const evalRes = q
      ? evaluateQuestionSlot(q, answers[qOrder], questionSet.question_type, qOrder, answers)
      : null;

    const hasOptionsBank = Boolean(questionSet.options && questionSet.options.length > 0);

    if (hasOptionsBank) {
      return (
        <span key={key} className="inline-flex items-center gap-1 mx-1 align-middle">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF6D3A] text-white text-[10px] font-extrabold shrink-0">
            {qOrder}
          </span>
          <select
            disabled={isSubmitted}
            value={val}
            onFocus={() => onFocusQuestion(qOrder)}
            onChange={(e) => onAnswerChange(qOrder, e.target.value)}
            className={`px-2 py-0.5 rounded-lg border text-xs font-bold outline-hidden transition ${
              isSubmitted && evalRes
                ? evalRes.isCorrect
                  ? 'border-[#13A62E] bg-[#E8F8EC] text-[#13A62E]'
                  : 'border-[#FF3532] bg-[#FFF1F1] text-[#FF3532]'
                : 'border-[#CBD5E1] bg-white text-[#FF6D3A] focus:border-[#FF6D3A] focus:ring-1 focus:ring-[#FF6D3A]'
            }`}
          >
            <option value="">-- {qOrder} --</option>
            {questionSet.options?.map((opt) => (
              <option key={opt.option} value={opt.option}>
                {opt.option}. {opt.text.slice(0, 48)}
              </option>
            ))}
          </select>
          {isSubmitted && evalRes && !evalRes.isCorrect && (
            <span className="text-[11px] font-extrabold text-[#13A62E] bg-[#E8F8EC] px-1.5 py-0.5 rounded">
              {evalRes.correctText}
            </span>
          )}
        </span>
      );
    }

    return (
      <span key={key} className="inline-flex items-center gap-1 mx-1 align-middle">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF6D3A] text-white text-[10px] font-extrabold shrink-0">
          {qOrder}
        </span>
        <input
          type="text"
          disabled={isSubmitted}
          value={val}
          onFocus={() => onFocusQuestion(qOrder)}
          onChange={(e) => onAnswerChange(qOrder, e.target.value)}
          placeholder={`(${qOrder})`}
          className={`w-28 sm:w-32 px-2 py-0.5 text-xs font-bold rounded-lg border outline-hidden transition ${
            isSubmitted && evalRes
              ? evalRes.isCorrect
                ? 'border-[#13A62E] bg-[#E8F8EC] text-[#13A62E]'
                : 'border-[#FF3532] bg-[#FFF1F1] text-[#FF3532]'
              : 'border-[#CBD5E1] bg-white text-[#FF6D3A] focus:border-[#FF6D3A] focus:ring-2 focus:ring-[#FF6D3A]/30'
          }`}
        />
        {isSubmitted && evalRes && !evalRes.isCorrect && (
          <span className="text-[11px] font-extrabold text-[#13A62E] bg-[#E8F8EC] px-1.5 py-0.5 rounded">
            ✓ {evalRes.correctText}
          </span>
        )}
      </span>
    );
  };

  // Convert rich HTML (tables, lists, paragraphs) safely into React nodes while hydrating `.gap-placeholder`
  const renderRichHtmlWithGaps = (rawHtml: string) => {
    if (typeof window === 'undefined' || !rawHtml) {
      return (
        <div
          className="prose prose-sm max-w-none text-xs sm:text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeYouPassHtml(rawHtml) }}
        />
      );
    }

    const doc = new DOMParser().parseFromString(sanitizeYouPassHtml(rawHtml), 'text/html');
    let gapCursor = 0;

    const convertNode = (node: ChildNode, keyPath: string): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === 'span' && el.classList.contains('gap-placeholder')) {
        const qIdAttr = el.getAttribute('data-question-id') || '';
        const match = qIdAttr.match(/(\d+)$/);
        const fallbackOrder = questionSet.questions?.[gapCursor]?.order ?? gapCursor + 1;
        const parsedOrder = match ? Number(match[1]) : fallbackOrder;
        const targetOrder = questionByOrder.has(parsedOrder) ? parsedOrder : fallbackOrder;
        gapCursor += 1;
        return renderInlineControl(targetOrder, `gap-${targetOrder}-${keyPath}`);
      }

      const children = Array.from(el.childNodes).map((child, idx) =>
        convertNode(child, `${keyPath}-${idx}`)
      );

      switch (tag) {
        case 'figure':
          return (
            <div key={keyPath} className="overflow-x-auto my-2">
              {children}
            </div>
          );
        case 'table':
          return (
            <table
              key={keyPath}
              className="w-full border-collapse border border-[#E5E5EA] text-xs sm:text-sm bg-white rounded-xl overflow-hidden"
            >
              {children}
            </table>
          );
        case 'thead':
          return <thead key={keyPath} className="bg-[#FFF1E5] text-[#4D2600]">{children}</thead>;
        case 'tbody':
          return <tbody key={keyPath}>{children}</tbody>;
        case 'tr':
          return <tr key={keyPath} className="border-b border-[#ECECEC]">{children}</tr>;
        case 'th':
          return (
            <th key={keyPath} className="border border-[#ECECEC] px-3 py-2 text-left font-bold">
              {children}
            </th>
          );
        case 'td':
          return (
            <td key={keyPath} className="border border-[#ECECEC] px-3 py-2 align-top leading-relaxed">
              {children}
            </td>
          );
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
          return (
            <h4 key={keyPath} className="font-extrabold text-[#4D2600] text-sm mt-2 mb-1.5">
              {children}
            </h4>
          );
        case 'p':
          return (
            <p key={keyPath} className="my-1.5 leading-relaxed text-[#333333]">
              {children}
            </p>
          );
        case 'ul':
          return (
            <ul key={keyPath} className="list-disc pl-5 space-y-1.5 my-2 text-[#333333]">
              {children}
            </ul>
          );
        case 'ol':
          return (
            <ol key={keyPath} className="list-decimal pl-5 space-y-1.5 my-2 text-[#333333]">
              {children}
            </ol>
          );
        case 'li':
          return (
            <li key={keyPath} className="leading-relaxed">
              {children}
            </li>
          );
        case 'strong':
        case 'b':
          return (
            <strong key={keyPath} className="font-bold text-[#1D1D1F]">
              {children}
            </strong>
          );
        case 'em':
        case 'i':
          return <em key={keyPath}>{children}</em>;
        case 'br':
          return <br key={keyPath} />;
        case 'img':
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={keyPath}
              src={el.getAttribute('src') || ''}
              alt={el.getAttribute('alt') || 'Diagram'}
              className="max-w-full h-auto rounded-xl border border-[#ECECEC] my-2"
            />
          );
        default:
          return (
            <div key={keyPath} className="text-xs sm:text-sm">
              {children}
            </div>
          );
      }
    };

    return (
      <div className="space-y-1">
        {Array.from(doc.body.childNodes).map((node, i) => convertNode(node, `root-${i}`))}
      </div>
    );
  };

  const hasGapContent = Boolean(
    questionSet.content && questionSet.content.includes('gap-placeholder')
  );

  // Deduplicated explain list when reviewing
  const renderReviewExplainBlock = (
    q: YouPassQuestion,
    slotOrder: number,
    groupOrders?: number[]
  ) => {
    if (!isSubmitted) return null;
    const isMulti = Boolean(groupOrders && groupOrders.length > 1);
    const evalRes = evaluateQuestionSlot(
      q,
      answers[slotOrder],
      questionSet.question_type,
      slotOrder,
      answers
    );
    let displayUser = evalRes.userText;
    let displayCorrect = evalRes.isCorrect;
    if (isMulti && groupOrders) {
      const picked = groupOrders
        .map((ord) => (typeof answers[ord] === 'string' ? (answers[ord] as string) : ''))
        .filter(Boolean);
      const expected = (q.correct_answers || []).map((x) => x.toUpperCase());
      displayUser = picked.join(', ') || 'Chưa làm';
      displayCorrect =
        expected.length > 0 &&
        picked.length === expected.length &&
        expected.every((a) => picked.includes(a));
    }
    const isExpanded = Boolean(expandedExplains[slotOrder]);

    return (
      <div className="mt-2 pt-2 border-t border-dashed border-[#ECECEC] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-extrabold text-[11px] ${
                displayCorrect
                  ? 'bg-[#E8F8EC] text-[#13A62E]'
                  : 'bg-[#FFF1F1] text-[#FF3532]'
              }`}
            >
              {displayCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              {displayCorrect ? 'Đúng' : 'Sai'}
            </span>
            <span className="text-[#8A8A8E]">
              Bạn chọn: <strong className="text-[#1D1D1F]">{displayUser}</strong>
            </span>
            <span className="text-[#8A8A8E]">
              ➔ Đáp án: <strong className="text-[#13A62E]">{evalRes.correctText}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {q.locate_info?.paragraph_ranges?.length && onLocateEvidence && (
              <button
                type="button"
                onClick={() => onLocateEvidence(slotOrder, q.locate_info)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF1E5] hover:bg-[#FFEBE0] text-[#4D2600] font-bold text-[11px] transition"
              >
                <MapPin className="w-3 h-3 text-[#FF6D3A]" />
                <span>Định vị câu</span>
              </button>
            )}

            {q.explain && (
              <button
                type="button"
                onClick={() => toggleExplain(slotOrder)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-bold text-[11px] transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isExpanded ? 'Ẩn Giải Thích' : 'Giải Thích 4 Bước'}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {isExpanded && q.explain && (
          <div
            className="p-3 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1] text-xs text-[#333333] leading-relaxed space-y-1.5 [&_u]:text-[#FF6D3A] [&_strong]:text-[#1D1D1F]"
            dangerouslySetInnerHTML={{ __html: sanitizeYouPassHtml(q.explain) }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#FFEDD1] shadow-xs space-y-4">
      {/* Group Title & Instructions (also renders map images if embedded in description) */}
      <div className="border-b border-[#ECECEC] pb-3 space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
          {questionSet.title}
        </span>
        {questionSet.description && (
          <div
            className="text-xs text-[#333333] leading-relaxed [&_p]:my-1 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-[#ECECEC] [&_img]:mt-2"
            dangerouslySetInnerHTML={{ __html: sanitizeYouPassHtml(questionSet.description) }}
          />
        )}
      </div>

      {/* Options Bank for MATCHING_HEADINGS */}
      {questionSet.question_type === 'MATCHING_HEADINGS' &&
        questionSet.options &&
        questionSet.options.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                List of Headings {questionSet.option_title ? `(${questionSet.option_title})` : ''}
              </span>
              {selectedHeading && (
                <span className="text-[11px] font-bold text-[#FF6D3A] animate-pulse">
                  Đang chọn: {selectedHeading.option} — bấm vào ô Drop Zone bên bài đọc!
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {questionSet.options.map((opt) => {
                const isSelected = selectedHeading?.option === opt.option;
                return (
                  <button
                    key={opt.option}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() =>
                      onSelectHeading(isSelected ? null : { option: opt.option, text: opt.text })
                    }
                    className={`p-2.5 text-left text-xs font-semibold rounded-xl border transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FF6D3A] text-white border-[#FF6D3A] shadow-sm ring-2 ring-[#FF6D3A]/30'
                        : 'bg-[#FFF8F2] text-[#4D2600] border-[#FFEDD1] hover:bg-[#FFEBE0]'
                    }`}
                  >
                    <span>
                      <strong className="mr-1.5">{opt.option}.</strong>
                      {opt.text}
                    </span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* Options Bank for NOTE_COMPLETION / MATCHING_ENDINGS / MATCHING_FEATURES */}
      {questionSet.question_type !== 'MATCHING_HEADINGS' &&
        questionSet.options &&
        questionSet.options.length > 0 &&
        ['NOTE_COMPLETION', 'MATCHING_ENDINGS', 'MATCHING_FEATURES'].includes(
          questionSet.question_type
        ) && (
          <div className="p-3.5 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1] space-y-2">
            <div className="text-xs font-bold text-[#4D2600] uppercase tracking-wider">
              {questionSet.option_title || 'Danh sách lựa chọn (Options)'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {questionSet.options.map((opt) => (
                <div
                  key={opt.option}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#FFEDD1] text-[#333333]"
                >
                  <strong className="text-[#FF6D3A] mr-1.5">{opt.option}</strong>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Main Content: Rich HTML with embedded Gap Placeholders */}
      {hasGapContent && questionSet.content && (
        <div className="p-4 rounded-xl bg-[#FFF8F2]/80 border border-[#FFEDD1]">
          {renderRichHtmlWithGaps(questionSet.content)}

          {/* In Review Mode, show per-question breakdown & explain toggles below the table/summary */}
          {isSubmitted && (
            <div className="mt-4 pt-3 border-t border-[#FFEDD1] space-y-2">
              <div className="text-xs font-extrabold text-[#4D2600]">
                Chi tiết đáp án & Giải thích từng câu ({questionSet.title}):
              </div>
              {questionSet.questions?.map((q) => (
                <div key={q.id} className="p-2.5 rounded-xl bg-white border border-[#ECECEC]">
                  <div className="text-xs font-bold text-[#1D1D1F]">
                    Câu {q.order}: <span className="font-normal text-[#8A8A8E]">{q.text}</span>
                  </div>
                  {renderReviewExplainBlock(q, q.order)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Standalone Question List (TRUE/FALSE, YES/NO, MULTIPLE_CHOICE_ONE, MULTIPLE_CHOICE_MANY, TABLE_SELECTION, MATCHING_HEADINGS selectors, or fallback GAP_FILLING without HTML gaps) */}
      {!hasGapContent && (
        <div className="space-y-4">
          {(questionSet.questions || []).map((q) => {
            const qType = questionSet.question_type;

            // Special Case: MULTIPLE_CHOICE_MANY (represents 2+ sequential question numbers e.g. 23 & 24)
            if (qType === 'MULTIPLE_CHOICE_MANY') {
              const maxSel = Math.max(
                1,
                questionSet.max_selections ||
                  q.correct_answers?.length ||
                  questionSet.question_count ||
                  2
              );
              const groupOrders = Array.from({ length: maxSel }, (_, idx) => q.order + idx);
              const currentSelected = groupOrders
                .map((ord) => (typeof answers[ord] === 'string' ? (answers[ord] as string) : ''))
                .filter(Boolean);

              const handleToggle = (optLetter: string) => {
                if (isSubmitted) return;
                onFocusQuestion(q.order);
                let next: string[];
                if (currentSelected.includes(optLetter)) {
                  next = currentSelected.filter((x) => x !== optLetter);
                } else if (currentSelected.length < maxSel) {
                  next = [...currentSelected, optLetter];
                } else {
                  next = [...currentSelected.slice(1), optLetter];
                }
                onMultiAnswerChange(groupOrders, next);
              };

              return (
                <div
                  key={q.id}
                  id={`q-card-${q.order}`}
                  className={`p-3.5 rounded-xl border transition space-y-3 ${
                    groupOrders.includes(activeQuestionOrder)
                      ? 'border-[#FF6D3A]/60 bg-[#FFF8F2]/50'
                      : 'border-[#ECECEC] bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#FF6D3A] text-white font-bold text-xs shrink-0">
                      {groupOrders[0]}–{groupOrders[groupOrders.length - 1]}
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-[#1D1D1F] leading-snug">
                        {q.text}
                      </p>
                      <span className="text-[11px] text-[#8A8A8E]">
                        Đã chọn {currentSelected.length}/{maxSel}:{' '}
                        <strong className="text-[#FF6D3A]">
                          {currentSelected.join(', ') || 'Chưa chọn'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pl-4">
                    {q.options?.map((opt) => {
                      const checked = currentSelected.includes(opt.option);
                      return (
                        <button
                          key={opt.option}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleToggle(opt.option)}
                          className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl border transition text-xs font-semibold ${
                            checked
                              ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] ring-1 ring-[#FF6D3A]'
                              : 'border-[#ECECEC] hover:bg-[#FFF8F2] text-[#333333]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              checked
                                ? 'bg-[#FF6D3A] border-[#FF6D3A] text-white'
                                : 'border-[#CBD5E1] bg-white'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" />}
                          </span>
                          <span className="font-bold">{opt.option}.</span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {renderReviewExplainBlock(q, q.order, groupOrders)}
                </div>
              );
            }

            // Standard Single Question Card
            const userVal = typeof answers[q.order] === 'string' ? (answers[q.order] as string) : '';
            const optionList =
              q.options && q.options.length > 0 ? q.options : questionSet.options || [];

            return (
              <div
                key={q.id}
                id={`q-card-${q.order}`}
                className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                  activeQuestionOrder === q.order
                    ? 'border-[#FF6D3A]/60 bg-[#FFF8F2]/50'
                    : 'border-[#ECECEC] bg-white'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {q.order}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-[#1D1D1F] leading-snug">
                      {q.text || `Câu ${q.order}`}
                    </p>
                  </div>
                </div>

                {/* SINGLE_CHOICE (Multiple Choice One Answer) */}
                {qType === 'SINGLE_CHOICE' && optionList.length > 0 && (
                  <div className="space-y-1.5 pl-8">
                    {optionList.map((opt) => {
                      const isChecked = userVal === opt.option;
                      return (
                        <button
                          key={opt.option}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => {
                            onFocusQuestion(q.order);
                            onAnswerChange(q.order, opt.option);
                          }}
                          className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl border transition text-xs font-semibold ${
                            isChecked
                              ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] ring-1 ring-[#FF6D3A]'
                              : 'border-[#ECECEC] hover:bg-[#FFF8F2] text-[#333333]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isChecked ? 'border-[#FF6D3A]' : 'border-[#CBD5E1]'
                            }`}
                          >
                            {isChecked && <span className="w-2 h-2 rounded-full bg-[#FF6D3A]" />}
                          </span>
                          <span className="font-bold">{opt.option}.</span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* SINGLE_SELECTION (TFNG / YNNG) or TABLE_SELECTION / MATCHING_* pills */}
                {qType !== 'SINGLE_CHOICE' && optionList.length > 0 && (
                  <div className="pl-8">
                    {qType === 'MATCHING_HEADINGS' ? (
                      <select
                        disabled={isSubmitted}
                        value={userVal}
                        onFocus={() => onFocusQuestion(q.order)}
                        onChange={(e) => onAnswerChange(q.order, e.target.value)}
                        className="w-full max-w-md px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#FFF8F2] text-xs font-bold text-[#4D2600] outline-hidden focus:border-[#FF6D3A]"
                      >
                        <option value="">-- Chọn Heading cho {q.text} --</option>
                        {optionList.map((opt) => (
                          <option key={opt.option} value={opt.option}>
                            {opt.option}. {opt.text}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {optionList.map((opt) => {
                          const isChecked = userVal === opt.option;
                          return (
                            <button
                              key={opt.option}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => {
                                onFocusQuestion(q.order);
                                onAnswerChange(q.order, isChecked ? '' : opt.option);
                              }}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition ${
                                isChecked
                                  ? 'bg-[#FF6D3A] text-white border-[#FF6D3A] shadow-xs'
                                  : 'bg-[#FFF8F2] text-[#4D2600] border-[#FFEDD1] hover:bg-[#FFEBE0]'
                              }`}
                              title={opt.text}
                            >
                              {opt.option}
                              {opt.text !== opt.option && optionList.length <= 4
                                ? ` (${opt.text})`
                                : ''}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Fallback Input when no options (standalone GAP_FILLING) */}
                {optionList.length === 0 && (
                  <div className="pl-8">
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={userVal}
                      onFocus={() => onFocusQuestion(q.order)}
                      onChange={(e) => onAnswerChange(q.order, e.target.value)}
                      placeholder="Nhập đáp án (1–3 từ / số)..."
                      className="w-full max-w-sm px-3 py-2 text-xs font-bold rounded-xl border border-[#CBD5E1] bg-[#FFF8F2] text-[#FF6D3A] outline-hidden focus:ring-2 focus:ring-[#FF6D3A]"
                    />
                  </div>
                )}

                {renderReviewExplainBlock(q, q.order)}
              </div>
            );
          })}
        </div>
      )}

      {/* Keep unused variable lint clean */}
      <span className="hidden" data-slot-count={slots.length} />
    </div>
  );
};
