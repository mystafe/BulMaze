'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { postJSON } from '@/lib/postJson';
import QuickNav from '@/components/QuickNav';

interface Clue {
  clue: string;
  answer: string;
  row: number;
  col: number;
}

interface CrosswordData {
  grid: (string | null)[][];
  clues: {
    across: Record<string, Clue>;
    down: Record<string, Clue>;
  };
}

type Direction = 'across' | 'down';

const CrosswordGame = () => {
  const { t, i18n } = useTranslation('game');
  const [solutionGrid, setSolutionGrid] = useState<(string | null)[][]>([]);
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [clues, setClues] = useState<{
    across: Record<string, Clue>;
    down: Record<string, Clue>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<Direction>('across');
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [focus, setFocus] = useState<{ r: number; c: number } | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchCrossword = useCallback(async () => {
    setLoading(true);
    setStatusMsg(null);
    const targetLanguage = localStorage.getItem('targetLanguage') || 'en';
    const data = await postJSON<CrosswordData>('/api/ai/quick-game', {
      gameType: 'crossword',
      targetLanguage,
      uiLanguage: (i18n.language as any) || 'en',
      count: 1,
      seed: Date.now(),
    });
    if (data && data.grid && data.clues) {
      setSolutionGrid(data.grid);
      setGrid(data.grid.map((row) => row.map((cell) => (cell ? '' : null))));
      setClues(data.clues);
      const firstAcross = Object.keys(data.clues.across || {})[0] || null;
      const firstDown = Object.keys(data.clues.down || {})[0] || null;
      const initDir: Direction = firstAcross ? 'across' : 'down';
      const initId = firstAcross || firstDown;
      setDirection(initDir);
      setActiveClueId(initId);
      if (initId) {
        // Use selectClue to keep logic consistent and focus first cell
        setTimeout(() => selectClue(initDir, initId), 0);
      }
    } else {
      console.error('Invalid crossword data from AI:', data);
    }
    setLoading(false);
  }, [i18n.language]);

  useEffect(() => {
    fetchCrossword();
  }, [fetchCrossword]);

  const wordPath = useMemo(() => {
    if (!clues || !activeClueId) return [] as Array<{ r: number; c: number }>;
    const c = clues[direction][activeClueId];
    if (!c) return [];
    const len = c.answer.length;
    const pts: Array<{ r: number; c: number }> = [];
    for (let i = 0; i < len; i++) {
      const r = direction === 'across' ? c.row : c.row + i;
      const col = direction === 'across' ? c.col + i : c.col;
      if (!solutionGrid[r] || solutionGrid[r][col] === null) break;
      pts.push({ r, c: col });
    }
    return pts;
  }, [clues, activeClueId, direction, solutionGrid]);

  const focusIndexInWord = useMemo(() => {
    if (!focus) return -1;
    return wordPath.findIndex((p) => p.r === focus.r && p.c === focus.c);
  }, [focus, wordPath]);

  const setFocusByIndex = (idx: number) => {
    if (!wordPath.length) return;
    const clamped = Math.max(0, Math.min(idx, wordPath.length - 1));
    const next = wordPath[clamped];
    setFocus(next);
    // focus DOM
    requestAnimationFrame(() => {
      const el = document.getElementById(
        `cell-${next.r}-${next.c}`,
      ) as HTMLInputElement | null;
      el?.focus();
    });
  };

  const idAtCell = (dir: Direction, r: number, c: number): string | null => {
    if (!clues) return null;
    const dict = clues[dir];
    for (const [id, cl] of Object.entries(dict)) {
      const len = cl.answer.length;
      if (dir === 'across') {
        if (r === cl.row && c >= cl.col && c < cl.col + len) return id;
      } else {
        if (c === cl.col && r >= cl.row && r < cl.row + len) return id;
      }
    }
    return null;
  };

  const selectClue = (dir: Direction, id: string) => {
    setDirection(dir);
    setActiveClueId(id);
    const cl = clues?.[dir]?.[id];
    if (cl) setFocus({ r: cl.row, c: cl.col });
  };

  const onCellChange = (r: number, c: number, valRaw: string) => {
    const val = valRaw
      .toUpperCase()
      .slice(0, 1)
      .replace(/[^A-ZÇĞİÖŞÜ]/, '');
    const next = grid.map((row) => [...row]);
    next[r][c] = val;
    setGrid(next);
    setStatusMsg(null);
    if (val && focusIndexInWord >= 0) {
      setFocusByIndex(focusIndexInWord + 1);
    }
  };

  const onCellKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    r: number,
    c: number,
  ) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const current = grid[r]?.[c] || '';
      if (current) {
        onCellChange(r, c, '');
      } else if (focusIndexInWord > 0) {
        setFocusByIndex(focusIndexInWord - 1);
        const prev = wordPath[focusIndexInWord - 1];
        const next = grid.map((row) => [...row]);
        next[prev.r][prev.c] = '';
        setGrid(next);
      }
      return;
    }
    if (e.key === ' ') {
      e.preventDefault();
      const newDir: Direction = direction === 'across' ? 'down' : 'across';
      const id =
        idAtCell(newDir, r, c) ||
        activeClueId ||
        Object.keys(clues?.[newDir] || {})[0] ||
        null;
      if (id) selectClue(newDir, id);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const list = Object.keys(clues?.[direction] || {});
      if (!list.length) return;
      const currIdx = activeClueId ? list.indexOf(activeClueId) : -1;
      const nextIdx = e.shiftKey
        ? currIdx <= 0
          ? list.length - 1
          : currIdx - 1
        : currIdx >= list.length - 1
          ? 0
          : currIdx + 1;
      selectClue(direction, list[nextIdx]);
      return;
    }
    if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      const delta = {
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
      } as const;
      const d = delta[e.key as keyof typeof delta];
      if (!d) return;
      let nr = r + d[0],
        nc = c + d[1];
      while (solutionGrid[nr]?.[nc] === null) {
        nr += d[0];
        nc += d[1];
        if (!solutionGrid[nr] || solutionGrid[nr][nc] === undefined) break;
      }
      if (
        solutionGrid[nr]?.[nc] !== undefined &&
        solutionGrid[nr]?.[nc] !== null
      ) {
        setFocus({ r: nr, c: nc });
        const id =
          idAtCell(direction, nr, nc) ||
          idAtCell(direction === 'across' ? 'down' : 'across', nr, nc);
        if (id) setActiveClueId(id);
      }
      return;
    }
    if (/^[A-Za-zÇĞİÖŞÜçğıöşü]$/.test(e.key)) {
      onCellChange(r, c, e.key);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      checkWord();
      return;
    }
  };

  const checkWord = () => {
    if (!wordPath.length) return;
    let ok = true;
    for (const p of wordPath) {
      const expected = (solutionGrid[p.r]?.[p.c] || '').toUpperCase();
      const got = (grid[p.r]?.[p.c] || '').toUpperCase();
      if (expected !== got) {
        ok = false;
        break;
      }
    }
    setStatusMsg(ok ? t('correct') : t('incorrect'));
  };

  const revealLetter = () => {
    // if no active, select first available
    if (!activeClueId && clues) {
      const first = Object.keys(clues[direction] || {})[0] || null;
      if (first) selectClue(direction, first);
    }
    if (!wordPath.length) return;
    const startIdx = focusIndexInWord >= 0 ? focusIndexInWord : 0;
    let targetIdx = -1;
    for (let i = startIdx; i < wordPath.length; i++) {
      const { r, c } = wordPath[i];
      const expected = (solutionGrid[r]?.[c] || '').toUpperCase();
      const got = (grid[r]?.[c] || '').toUpperCase();
      if (got !== expected) {
        targetIdx = i;
        break;
      }
    }
    if (targetIdx === -1) {
      for (let i = 0; i < startIdx; i++) {
        const { r, c } = wordPath[i];
        const expected = (solutionGrid[r]?.[c] || '').toUpperCase();
        const got = (grid[r]?.[c] || '').toUpperCase();
        if (got !== expected) {
          targetIdx = i;
          break;
        }
      }
    }
    if (targetIdx !== -1) {
      const { r, c } = wordPath[targetIdx];
      const next = grid.map((row) => [...row]);
      next[r][c] = (solutionGrid[r]?.[c] || '').toUpperCase();
      setGrid(next);
      setFocus({ r, c });
      setTimeout(
        () => setFocusByIndex(Math.min(targetIdx + 1, wordPath.length - 1)),
        0,
      );
    } else {
      setStatusMsg(t('correct'));
    }
  };

  const revealWord = () => {
    const next = grid.map((row) => [...row]);
    for (const p of wordPath) {
      next[p.r][p.c] = (solutionGrid[p.r]?.[p.c] || '').toUpperCase();
    }
    setGrid(next);
  };

  const clearWord = () => {
    const next = grid.map((row) => [...row]);
    for (const p of wordPath) next[p.r][p.c] = '';
    setGrid(next);
    if (wordPath.length) setFocus(wordPath[0]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          {t('crossword_title', { defaultValue: 'Crossword' })}
        </h1>
        <QuickNav />
        <div>{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">
        {t('crossword_title', { defaultValue: 'Crossword' })}
      </h1>
      <QuickNav />
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={fetchCrossword}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          {t('new_game')}
        </button>
        <button
          onClick={checkWord}
          disabled={!activeClueId}
          className="px-3 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
        >
          {t('check')}
        </button>
        <button
          onClick={() =>
            setDirection(direction === 'across' ? 'down' : 'across')
          }
          className="px-3 py-2 bg-gray-600 text-white rounded"
        >
          {t('toggle_direction', { defaultValue: 'Toggle' })}
        </button>
        <button
          onClick={revealLetter}
          disabled={!activeClueId}
          className="px-3 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        >
          {t('reveal_letter', { defaultValue: 'Reveal letter' })}
        </button>
        <button
          onClick={revealWord}
          disabled={!activeClueId}
          className="px-3 py-2 bg-purple-700 text-white rounded disabled:opacity-50"
        >
          {t('reveal_word', { defaultValue: 'Reveal word' })}
        </button>
        <button
          onClick={clearWord}
          disabled={!activeClueId}
          className="px-3 py-2 bg-amber-600 text-white rounded disabled:opacity-50"
        >
          {t('clear_word', { defaultValue: 'Clear word' })}
        </button>
        {activeClueId && (
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            {direction.toUpperCase()} {activeClueId}:{' '}
            {clues?.[direction]?.[activeClueId!]?.clue}
          </span>
        )}
        {wordPath.length > 0 && (
          <span className="ml-2 text-xs text-gray-500">
            (
            {wordPath
              .map(({ r, c }) =>
                grid[r]?.[c] ? (grid[r]![c] as string).toUpperCase() : '_',
              )
              .join('')}
            , {wordPath.length})
          </span>
        )}
      </div>
      {statusMsg && <div className="mb-3 text-sm">{statusMsg}</div>}
      <div className="flex flex-col md:flex-row gap-8">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${solutionGrid[0]?.length || 10}, 2rem)`,
          }}
        >
          {solutionGrid.map((row, r) =>
            row.map((sol, c) => {
              const isBlock = sol === null;
              const isActive = wordPath.some((p) => p.r === r && p.c === c);
              const focused = focus?.r === r && focus?.c === c;
              const idAcross = clues ? idAtCell('across', r, c) : null;
              const idDown = clues ? idAtCell('down', r, c) : null;
              const clueNumber = idAcross || idDown;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-8 h-8 border border-gray-400 relative ${isActive ? 'bg-yellow-100 dark:bg-yellow-800' : ''} ${isBlock ? 'bg-gray-400 dark:bg-gray-800 pointer-events-none cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (isBlock) return;
                    if (!isActive) {
                      const preferred =
                        idAtCell(direction, r, c) ||
                        idAtCell(
                          direction === 'across' ? 'down' : 'across',
                          r,
                          c,
                        );
                      if (preferred)
                        selectClue(
                          preferred === idAtCell('across', r, c)
                            ? 'across'
                            : 'down',
                          preferred,
                        );
                    }
                  }}
                >
                  {clueNumber && !isBlock && (
                    <span className="absolute top-0 left-1 text-[10px] leading-none">
                      {clueNumber}
                    </span>
                  )}
                  {!isBlock && (
                    <input
                      id={`cell-${r}-${c}`}
                      type="text"
                      maxLength={1}
                      value={grid[r]?.[c] || ''}
                      onChange={(e) => onCellChange(r, c, e.target.value)}
                      onKeyDown={(e) => onCellKeyDown(e, r, c)}
                      onFocus={() => {
                        setFocus({ r, c });
                        const pref = direction;
                        const found =
                          (pref === 'across' ? idAcross : idDown) ||
                          idAcross ||
                          idDown;
                        if (found) {
                          const d: Direction =
                            found === idAcross ? 'across' : 'down';
                          setDirection(d);
                          setActiveClueId(found);
                        }
                      }}
                      disabled={!isActive}
                      className={`w-full h-full text-center bg-transparent outline-none ${focused ? 'ring-2 ring-blue-400' : ''} ${!isActive ? 'cursor-pointer' : ''}`}
                    />
                  )}
                </div>
              );
            }),
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {t('across', { defaultValue: 'Across' })}
          </h2>
          <ul>
            {clues &&
              Object.entries(clues.across).map(([num, clue]) => (
                <li key={num}>
                  <button
                    className="underline"
                    onClick={() => selectClue('across', num)}
                  >
                    {num}. {clue.clue}
                  </button>
                </li>
              ))}
          </ul>
          <h2 className="text-2xl font-semibold mt-4">
            {t('down', { defaultValue: 'Down' })}
          </h2>
          <ul>
            {clues &&
              Object.entries(clues.down).map(([num, clue]) => (
                <li key={num}>
                  <button
                    className="underline"
                    onClick={() => selectClue('down', num)}
                  >
                    {num}. {clue.clue}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrosswordGame;
