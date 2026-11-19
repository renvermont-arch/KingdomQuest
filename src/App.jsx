import { useEffect, useMemo, useState } from "react";
import PixelDirtBackground from "./components/PixelDirtBackground.jsx";
import { organisms } from "./data/organisms";
import { FULL_RANKS, MODE_CONFIG, MODE_IDS, optionFor } from "./data/taxonomy";

const ROUND_LENGTHS = [5, 10, 15];
const PEEK_COST = 25;
const FULL_RANK_POINTS = 25;
const SKIP_KEY = "__skip__";

// Mobile groups the nine quests into three short, tappable sets so setup stays
// compact instead of becoming one very long scrolling list.
const QUEST_GROUPS = [
  { id: "big", label: "Big picture", modes: ["full", "domain", "kingdom"] },
  { id: "middle", label: "In between", modes: ["phylum", "class", "order"] },
  { id: "fine", label: "Up close", modes: ["family", "genus", "species"] },
];

function groupForMode(mode) {
  return QUEST_GROUPS.find((group) => group.modes.includes(mode))?.id ?? "big";
}

// The ladder is split into three short screens on phones; desktops still see
// every rung at once.
const LADDER_GROUPS = [FULL_RANKS.slice(0, 3), FULL_RANKS.slice(3, 6), FULL_RANKS.slice(6)];

function pageForRank(rank) {
  return Math.floor(FULL_RANKS.indexOf(rank) / 3);
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeQuestions(mode, count) {
  const pickedOrganisms = shuffle(organisms).slice(0, count);

  if (mode === "full") {
    return pickedOrganisms.map((organism) => ({
      organism,
      optionsByRank: Object.fromEntries(
        FULL_RANKS.map((rank) => {
          const values = MODE_CONFIG[rank].options.map((option) => option.value);
          const distractorCount = Math.min(3, values.length - 1);
          const distractors = shuffle(values.filter((value) => value !== organism[rank])).slice(0, distractorCount);
          return [rank, shuffle([organism[rank], ...distractors])];
        }),
      ),
    }));
  }

  const allValues = MODE_CONFIG[mode].options.map((option) => option.value);

  return pickedOrganisms.map((organism) => {
    const correctValue = organism[mode];
    const distractorCount = Math.min(3, allValues.length - 1);
    const distractors = shuffle(allValues.filter((value) => value !== correctValue)).slice(0, distractorCount);
    const options = shuffle([correctValue, ...distractors]).map((value) => optionFor(mode, value));

    return { organism, correctValue, options };
  });
}

function readBest(mode) {
  try {
    const stored = window.localStorage.getItem(`kingdom-quest-best-${mode}`);
    return stored ? Number(stored) : 0;
  } catch {
    return 0;
  }
}

function writeBest(mode, score) {
  try {
    window.localStorage.setItem(`kingdom-quest-best-${mode}`, String(score));
  } catch {
    // Local storage may be disabled; the game still works fine.
  }
}

function Confetti({ seed }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        left: `${(index * 29 + seed * 13) % 100}%`,
        delay: `${(index % 6) * 0.07}s`,
        duration: `${0.9 + (index % 4) * 0.15}s`,
        color: ["#ff7fa8", "#ffd166", "#7c7bff", "#25b8a3", "#ff9f68"][index % 5],
        rotate: `${(index * 47) % 360}deg`,
      })),
    [seed],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, index) => (
        <span
          key={index}
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function HomeScreen({ mode, setMode, roundLength, setRoundLength, bestScores, onStart }) {
  const [activeGroup, setActiveGroup] = useState(() => groupForMode(mode));
  const selectedQuest = MODE_CONFIG[mode];

  return (
    <div className="screen home-screen">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A tiny classification adventure 💗</span>
          <h1>
            Kingdom <span>Quest</span>
          </h1>
          <p>
            Meet a creature, read its clues, and place it from domain all the way down to species.
            No timers, no pressure — just curiosity.
          </p>
          <div className="hero-hearts" aria-hidden="true">
            <span>🦁</span>
            <span>🌻</span>
            <span>🍄</span>
            <span>🐙</span>
            <span>🦋</span>
          </div>
        </div>
        <div className="hero-badge" aria-hidden="true">
          <div className="hero-badge-inner">
            <span className="badge-crown">👑</span>
            <strong>Life</strong>
            <small>classified</small>
          </div>
        </div>
      </section>

      <section className="setup">
        <div className="section-heading">
          <h2>1. Pick your quest</h2>
          <p>Each one looks at a different branch of taxonomy.</p>
        </div>

        <div className="quest-tabs" role="group" aria-label="Quest categories">
          {QUEST_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              className={activeGroup === group.id ? "is-active" : ""}
              aria-pressed={activeGroup === group.id}
              onClick={() => setActiveGroup(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="mode-grid" data-active-group={activeGroup}>
          {MODE_IDS.map((id) => {
            const item = MODE_CONFIG[id];
            const isActive = mode === id;

            return (
              <button
                key={id}
                type="button"
                data-group={groupForMode(id)}
                className={`mode-card ${isActive ? "is-active" : ""} ${id === "full" ? "is-featured" : ""}`}
                style={{ "--card-accent": item.accent, "--card-soft": item.soft }}
                onClick={() => setMode(id)}
                aria-pressed={isActive}
              >
                <span className="mode-icon" aria-hidden="true">{item.icon}</span>
                <strong>{item.title}</strong>
                <span className="mode-rank">{id === "full" ? "All ranks together" : `Identify the ${item.rank}`}</span>
                <span className="mode-blurb">{item.blurb}</span>
                <span className="mode-best">
                  Best <b>{bestScores[id].toLocaleString()}</b>
                </span>
              </button>
            );
          })}
        </div>

        <div className="section-heading second">
          <h2>2. Choose a round length</h2>
          <p>Short and sweet, or a longer stroll?</p>
        </div>

        <div className="length-picker" role="group" aria-label="Round length">
          {ROUND_LENGTHS.map((length) => (
            <button
              key={length}
              type="button"
              className={roundLength === length ? "is-active" : ""}
              onClick={() => setRoundLength(length)}
              aria-pressed={roundLength === length}
            >
              {length} questions
            </button>
          ))}
        </div>

        <button type="button" className="primary start-button" onClick={() => onStart(mode, roundLength)}>
          Start exploring <span aria-hidden="true">→</span>
        </button>
        <p className="made-with-love">Made with love, for someone who makes the world brighter. ✨</p>
      </section>

      <div className="mobile-start-bar">
        <div className="mobile-start-copy">
          <strong>{selectedQuest.icon} {selectedQuest.title}</strong>
          <span>{roundLength} questions · Best {bestScores[mode].toLocaleString()} pts</span>
        </div>
        <button type="button" className="primary" onClick={() => onStart(mode, roundLength)}>
          Start <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function Feedback({ answer, mode, config, question, isCorrect, skipped }) {
  const correctLabel = optionFor(mode, question.correctValue).label;
  const explanation =
    config.id === "domain"
      ? question.organism.domain === "Eukaryota"
        ? "Its cells have a nucleus and membrane-bound organelles."
        : "Its cells have no nucleus, which makes it a prokaryote."
      : question.organism.note;

  return (
    <div className={`feedback ${isCorrect ? "is-good" : skipped ? "is-skip" : "is-bad"}`} role="status" aria-live="polite">
      {isCorrect && <Confetti seed={question.organism.id.length} />}
      <div className="feedback-icon" aria-hidden="true">
        {isCorrect ? "🎉" : skipped ? "⏭️" : "💡"}
      </div>
      <div className="feedback-copy">
        <h3>
          {isCorrect
            ? `Lovely! +${answer.points} points`
            : skipped
              ? "No worries — let's learn it!"
              : "Not quite — here's the scoop"}
        </h3>
        <p>
          <strong>{question.organism.name}</strong> belongs to <strong>{correctLabel}</strong> at the {config.rank} level.{" "}
          {explanation}
        </p>
        {!isCorrect && !skipped && (
          <p className="correct-answer"><span>Correct answer</span> {correctLabel}</p>
        )}
        <p className="fact">✨ {question.organism.fact}</p>
      </div>
    </div>
  );
}

function FullFeedback({ answer, organism }) {
  const results = answer.rankResults ?? {};
  const rightCount = Object.values(results).filter((result) => result.correct).length;
  const perfect = answer.selected !== SKIP_KEY && rightCount === FULL_RANKS.length;

  return (
    <div className={`feedback full-feedback ${perfect ? "is-good" : "is-bad"}`} role="status" aria-live="polite">
      {perfect && <Confetti seed={organism.id.length} />}
      <div className="feedback-icon" aria-hidden="true">
        {perfect ? "🏆" : answer.selected === SKIP_KEY ? "⏭️" : "🧭"}
      </div>
      <div className="feedback-copy">
        <h3>
          {perfect
            ? `Perfect ladder! +${answer.points} points`
            : answer.selected === SKIP_KEY
              ? "Skipped — here's the full ladder"
              : `+${answer.points} points — ${rightCount} of ${FULL_RANKS.length} rungs right`}
        </h3>
        <div className="rank-results">
          {FULL_RANKS.map((rank) => {
            const result = results[rank] ?? {
              selected: "",
              correctValue: organism[rank],
              correct: false,
            };
            const correctText = optionFor(rank, result.correctValue).label;
            const chosenText = result.selected ? optionFor(rank, result.selected).label : "—";

            return (
              <div key={rank} className={result.correct ? "ok" : "no"}>
                <span>{rank}</span>
                <strong>{correctText}</strong>
                {!result.correct && <small>you chose {chosenText}</small>}
              </div>
            );
          })}
        </div>
        <p className="fact">✨ {organism.fact}</p>
      </div>
    </div>
  );
}

function FullGameScreen({
  config,
  current,
  index,
  total,
  score,
  streak,
  bestStreak,
  answered,
  fullSelections,
  peeked,
  progress,
  lastAnswer,
  onSelect,
  onPeek,
  onSubmit,
  onSkip,
  onNext,
  onExit,
}) {
  const { organism } = current;
  const [ladderPage, setLadderPage] = useState(0);
  const ready = FULL_RANKS.every((rank) => fullSelections[rank]);
  const showAnswers = answered && Boolean(lastAnswer?.isFull);

  useEffect(() => {
    setLadderPage(0);
  }, [index]);

  return (
    <div className="screen game-screen">
      <header className="game-top">
        <button type="button" className="icon-button" onClick={onExit} aria-label="Leave game and go home">
          ←
        </button>
        <div className="mode-tag">
          <span aria-hidden="true">{config.icon}</span> {config.title}
        </div>
        <div className="live-stats">
          <span><b>{score.toLocaleString()}</b> pts</span>
          <span className="streak-pill">🔥 {streak}</span>
        </div>
      </header>

      <div className="progress-track" aria-label={`Question ${index + 1} of ${total}`}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="question-meta">
        <span>Question {index + 1} of {total}</span>
        <span>Build the full ladder</span>
      </div>

      <section
        className="question-card"
        style={{ "--card-a": organism.colors[0], "--card-b": organism.colors[1] }}
      >
        <div className="creature-emoji" aria-hidden="true">{organism.emoji}</div>
        <div className="creature-info">
          <h2>{organism.name}</h2>
          <p className="clue">{organism.clue}</p>
          {answered || peeked ? (
            <p className="sci-name">
              <span>Scientific name</span> {organism.scientificName}
            </p>
          ) : (
            <button type="button" className="peek-button" onClick={onPeek}>
              👀 Peek at scientific name <small>−{PEEK_COST} pts</small>
            </button>
          )}
        </div>
      </section>

      <p className="ladder-intro">
        Pick one answer for each rung, then check your ladder.
        <span>{FULL_RANK_POINTS} pts per correct rung</span>
      </p>

      <div className="ladder-pager" role="group" aria-label="Ladder rung groups">
        {LADDER_GROUPS.map((ranks, page) => (
          <button
            key={page}
            type="button"
            className={ladderPage === page ? "is-active" : ""}
            aria-pressed={ladderPage === page}
            onClick={() => setLadderPage(page)}
          >
            <span>{page === 2 ? "7–8" : `${page * 3 + 1}–${page * 3 + 3}`}</span>
            <small>{ranks.filter((rank) => fullSelections[rank]).length}/{ranks.length} picked</small>
          </button>
        ))}
      </div>

      <div className="ladder">
        {FULL_RANKS.map((rank, position) => {
          const result = showAnswers ? lastAnswer?.rankResults?.[rank] : null;
          const value = showAnswers ? (result?.selected ?? "") : (fullSelections[rank] ?? "");

          return (
            <div
              className={`ladder-row ${pageForRank(rank) !== ladderPage ? "is-mobile-hidden" : ""}`}
              key={rank}
            >
              <span className="ladder-number">{position + 1}</span>
              <span className="ladder-rank">{rank}</span>
              <div className={`ladder-select-wrap ${showAnswers ? "is-answered" : ""}`}>
                <select
                  value={value}
                  onChange={(event) => onSelect(rank, event.target.value)}
                  disabled={answered}
                  aria-label={`Choose ${rank}`}
                >
                  <option value="">Choose {rank}…</option>
                  {MODE_CONFIG[rank].options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}{option.hint ? ` — ${option.hint}` : ""}
                    </option>
                  ))}
                </select>
                {!showAnswers && <span className="select-caret" aria-hidden="true">⌄</span>}
                {showAnswers && result && (
                  <span className={`ladder-mark ${result.correct ? "ok" : "no"}`} aria-hidden="true">
                    {result.correct ? "✓" : "✕"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!answered ? (
        <div className="ladder-actions">
          <button type="button" className="text-button" onClick={onSkip}>Skip for now</button>
          <div className="ladder-action-right">
            <span className="points-note">Best streak this round: {bestStreak} 🔥</span>
            <button type="button" className="primary" onClick={onSubmit} disabled={!ready}>
              Check ladder <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      ) : (
        showAnswers && lastAnswer && (
          <>
            <div className="answer-scrim" aria-hidden="true" />
            <div className="answer-panel">
              <span className="sheet-handle" aria-hidden="true" />
              <FullFeedback answer={lastAnswer} organism={organism} />
              <button type="button" className="primary next-button" onClick={onNext}>
                {index + 1 === total ? "See results" : "Next creature"} <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}

function GameScreen({
  config,
  current,
  index,
  total,
  score,
  streak,
  bestStreak,
  selected,
  answered,
  isCorrect,
  skipped,
  peeked,
  progress,
  lastAnswer,
  onPeek,
  onAnswer,
  onSkip,
  onNext,
  onExit,
}) {
  const { organism } = current;

  return (
    <div className="screen game-screen">
      <header className="game-top">
        <button type="button" className="icon-button" onClick={onExit} aria-label="Leave game and go home">
          ←
        </button>
        <div className="mode-tag">
          <span aria-hidden="true">{config.icon}</span> {config.title}
        </div>
        <div className="live-stats">
          <span><b>{score.toLocaleString()}</b> pts</span>
          <span className="streak-pill">🔥 {streak}</span>
        </div>
      </header>

      <div className="progress-track" aria-label={`Question ${index + 1} of ${total}`}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="question-meta">
        <span>Question {index + 1} of {total}</span>
        <span>Which {config.rank}?</span>
      </div>

      <section
        className="question-card"
        style={{ "--card-a": organism.colors[0], "--card-b": organism.colors[1] }}
      >
        <div className="creature-emoji" aria-hidden="true">{organism.emoji}</div>
        <div className="creature-info">
          <h2>{organism.name}</h2>
          <p className="clue">{organism.clue}</p>
          {answered || peeked ? (
            <p className="sci-name">
              <span>Scientific name</span> {organism.scientificName}
            </p>
          ) : (
            <button type="button" className="peek-button" onClick={onPeek}>
              👀 Peek at scientific name <small>−{PEEK_COST} pts</small>
            </button>
          )}
        </div>
      </section>

      <section className="options" aria-label={`Choose the ${config.rank}`}>
        {current.options.map((option) => {
          const isChosen = selected === option.value;
          const isAnswer = option.value === current.correctValue;
          let state = "";

          if (answered) {
            if (isAnswer) state = "is-correct";
            else if (isChosen) state = "is-wrong";
            else state = "is-dim";
          }

          return (
            <button
              key={option.value}
              type="button"
              className={`option ${state}`}
              onClick={() => onAnswer(option.value)}
              disabled={answered}
            >
              <span className="option-label">{option.label}</span>
              {option.hint && <span className="option-hint">{option.hint}</span>}
              {answered && isAnswer && <span className="option-badge good" aria-hidden="true">✓</span>}
              {answered && isChosen && !isAnswer && <span className="option-badge bad" aria-hidden="true">✕</span>}
            </button>
          );
        })}
      </section>

      {!answered ? (
        <div className="question-actions">
          <button type="button" className="text-button" onClick={onSkip}>Skip for now</button>
          <span className="best-streak">Best streak this round: {bestStreak} 🔥</span>
        </div>
      ) : (
        lastAnswer && (
          <>
            <div className="answer-scrim" aria-hidden="true" />
            <div className="answer-panel">
              <span className="sheet-handle" aria-hidden="true" />
              <Feedback
                answer={lastAnswer}
                mode={config.id}
                config={config}
                question={current}
                isCorrect={isCorrect}
                skipped={skipped}
              />
              <button type="button" className="primary next-button" onClick={onNext}>
                {index + 1 === total ? "See results" : "Next creature"} <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}

function ResultsScreen({
  config,
  score,
  accuracy,
  correctCount,
  totalUnits,
  bestStreak,
  answers,
  bestScore,
  isNewBest,
  onRestart,
  onHome,
}) {
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const verdict =
    accuracy === 100
      ? { emoji: "🏆", title: "Taxonomy Superstar!", line: "You classified every single one. My heart is officially impressed." }
      : accuracy >= 80
        ? { emoji: "🌟", title: "Rising Naturalist!", line: "You have a sharp eye for the tree of life. Absolutely lovely work." }
        : accuracy >= 50
          ? { emoji: "🌱", title: "Curious Explorer!", line: "Every guess grows your knowledge. You're doing wonderfully." }
          : { emoji: "💗", title: "Brave Beginner!", line: "Trying something new is the sweetest kind of courage. Let's go again!" };

  return (
    <div className="screen results-screen">
      <section className="result-hero">
        <div className="result-emoji" aria-hidden="true">{verdict.emoji}</div>
        <span className="eyebrow">{config.title} complete</span>
        <h1>{verdict.title}</h1>
        <p>{verdict.line}</p>
        {isNewBest && <div className="new-best">✨ New personal best!</div>}
      </section>

      <section className="stats-grid" aria-label="Your results">
        <div><strong>{score.toLocaleString()}</strong><span>points</span></div>
        <div><strong>{accuracy}%</strong><span>accuracy</span></div>
        <div><strong>{correctCount}/{totalUnits}</strong><span>correct picks</span></div>
        <div><strong>{bestStreak} 🔥</strong><span>best streak</span></div>
      </section>

      <section className="review">
        <div className="section-heading">
          <h2>Your creature review</h2>
          <p>Personal best for this quest: <b>{bestScore.toLocaleString()}</b> pts</p>
        </div>
        <ul className={`review-list ${showAllAnswers ? "is-expanded" : ""}`}>
          {answers.map((answer, index) => {
            const results = Object.values(answer.rankResults ?? {});
            const isFullAnswer = Boolean(answer.isFull || results.length);
            let detail;

            if (isFullAnswer) {
              if (answer.selected === SKIP_KEY) {
                detail = "Skipped";
              } else {
                const wrongRanks = results.filter((result) => !result.correct);
                detail = wrongRanks.length
                  ? wrongRanks
                      .map(
                        (result) =>
                          `${result.rank.charAt(0).toUpperCase()}${result.rank.slice(1)}: ${optionFor(result.rank, result.correctValue).label}`,
                      )
                      .join(" · ")
                  : "All ranks correct";
              }
            } else {
              const correctLabel = optionFor(config.id, answer.question.correctValue).label;
              const chosenLabel =
                answer.selected === SKIP_KEY ? "Skipped" : optionFor(config.id, answer.selected).label;
              detail =
                answer.selected === SKIP_KEY
                  ? `Skipped · Correct: ${correctLabel}`
                  : answer.correct
                    ? correctLabel
                    : `You chose ${chosenLabel} · Correct: ${correctLabel}`;
            }

            return (
              <li key={`${answer.question.organism.id}-${index}`} className={answer.correct ? "right" : "wrong"}>
                <span className="review-emoji" aria-hidden="true">{answer.question.organism.emoji}</span>
                <div className="review-name">
                  <strong>{answer.question.organism.name}</strong>
                  <small>{detail}</small>
                </div>
                <span className="review-mark" aria-hidden="true">{answer.correct ? "✓" : "✕"}</span>
              </li>
            );
          })}
        </ul>
        <button type="button" className="review-toggle" onClick={() => setShowAllAnswers((previous) => !previous)}>
          {showAllAnswers ? "Show fewer answers" : `Show all ${answers.length} answers`}
        </button>
      </section>

      <div className="result-actions">
        <button type="button" className="primary" onClick={onRestart}>Play again <span aria-hidden="true">↻</span></button>
        <button type="button" className="secondary" onClick={onHome}>Choose another quest</button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("full");
  const [roundLength, setRoundLength] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [fullSelections, setFullSelections] = useState({});
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [peeked, setPeeked] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [bestScores, setBestScores] = useState(() =>
    Object.fromEntries(MODE_IDS.map((id) => [id, readBest(id)])),
  );

  const config = MODE_CONFIG[mode];
  const current = questions[index];
  const answered = selected !== null;
  const skipped = selected === SKIP_KEY;
  const lastAnswer = answers[answers.length - 1];
  const isCorrect = answered && (lastAnswer?.correct ?? false);
  const progress = questions.length ? ((index + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  const scoringUnits = answers.map((answer) => {
    const results = Object.values(answer.rankResults ?? {});
    return results.length
      ? { total: results.length, correct: results.filter((result) => result.correct).length }
      : { total: 1, correct: answer.correct ? 1 : 0 };
  });
  const totalUnits = scoringUnits.reduce((sum, unit) => sum + unit.total, 0);
  const correctCount = scoringUnits.reduce((sum, unit) => sum + unit.correct, 0);
  const accuracy = totalUnits ? Math.round((correctCount / totalUnits) * 100) : 0;

  useEffect(() => {
    document.title = screen === "game" && current
      ? `Question ${index + 1} · Kingdom Quest 💗`
      : "Kingdom Quest 💗";
  }, [screen, index, current]);

  function startGame(nextMode = mode, length = roundLength) {
    setMode(nextMode);
    setRoundLength(length);
    setQuestions(makeQuestions(nextMode, length));
    setIndex(0);
    setSelected(null);
    setFullSelections({});
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnswers([]);
    setPeeked(false);
    setNewBest(false);
    setScreen("game");
  }

  function handleAnswer(value) {
    if (answered || !current) return;

    const correct = value === current.correctValue;
    const base = 100 + Math.min(streak, 5) * 20;
    const points = correct ? (peeked ? Math.max(50, base - PEEK_COST) : base) : 0;

    setSelected(value);
    setScore((previous) => previous + points);
    setStreak((previous) => (correct ? previous + 1 : 0));

    if (correct) {
      setBestStreak((previous) => Math.max(previous, streak + 1));
    }

    setAnswers((previous) => [
      ...previous,
      { question: current, selected: value, correct, points, peeked },
    ]);
  }

  function handleFullSelect(rank, value) {
    setFullSelections((previous) => ({ ...previous, [rank]: value }));
  }

  function handleFullSubmit() {
    if (answered || !current || mode !== "full") return;
    if (!FULL_RANKS.every((rank) => fullSelections[rank])) return;

    const rankResults = Object.fromEntries(
      FULL_RANKS.map((rank) => {
        const correctValue = current.organism[rank];
        const chosen = fullSelections[rank];
        return [rank, { rank, selected: chosen, correctValue, correct: chosen === correctValue }];
      }),
    );

    const rightCount = Object.values(rankResults).filter((result) => result.correct).length;
    const perfect = rightCount === FULL_RANKS.length;
    let points = rightCount * FULL_RANK_POINTS;

    if (perfect) {
      points += Math.min(streak, 5) * 20;
    }
    if (peeked) {
      points = Math.max(0, points - PEEK_COST);
    }

    setSelected(fullSelections);
    setScore((previous) => previous + points);
    setStreak((previous) => (perfect ? previous + 1 : 0));

    if (perfect) {
      setBestStreak((previous) => Math.max(previous, streak + 1));
    }

    setAnswers((previous) => [
      ...previous,
      {
        question: current,
        selected: fullSelections,
        correct: perfect,
        points,
        peeked,
        rankResults,
        isFull: true,
      },
    ]);
  }

  function handleSkip() {
    if (answered || !current) return;

    const rankResults = mode === "full"
      ? Object.fromEntries(
          FULL_RANKS.map((rank) => [
            rank,
            { rank, selected: "", correctValue: current.organism[rank], correct: false },
          ]),
        )
      : undefined;

    setSelected(SKIP_KEY);
    setStreak(0);
    setAnswers((previous) => [
      ...previous,
      {
        question: current,
        selected: SKIP_KEY,
        correct: false,
        points: 0,
        peeked,
        rankResults,
        isFull: mode === "full",
      },
    ]);
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      if (score > bestScores[mode]) {
        setBestScores((previous) => ({ ...previous, [mode]: score }));
        writeBest(mode, score);
        setNewBest(true);
      }
      setScreen("results");
      return;
    }

    setIndex((previous) => previous + 1);
    setSelected(null);
    setFullSelections({});
    setPeeked(false);
  }

  return (
    <div className="app" style={{ "--accent": config.accent, "--accent-soft": config.soft }}>
      <div className="background-decor" aria-hidden="true">
        <span className="blob blob-one" />
        <span className="blob blob-two" />
        <span className="blob blob-three" />
        <span className="sparkle sparkle-one">✦</span>
        <span className="sparkle sparkle-two">✧</span>
        <span className="sparkle sparkle-three">✦</span>
        <PixelDirtBackground />
      </div>

      <main className="shell">
        {screen === "home" && (
          <HomeScreen
            mode={mode}
            setMode={setMode}
            roundLength={roundLength}
            setRoundLength={setRoundLength}
            bestScores={bestScores}
            onStart={startGame}
          />
        )}

        {screen === "game" && current && (
          mode === "full" ? (
            <FullGameScreen
              config={config}
              current={current}
              index={index}
              total={questions.length}
              score={score}
              streak={streak}
              bestStreak={bestStreak}
              answered={answered}
              fullSelections={fullSelections}
              peeked={peeked}
              progress={progress}
              lastAnswer={lastAnswer}
              onSelect={handleFullSelect}
              onPeek={() => setPeeked(true)}
              onSubmit={handleFullSubmit}
              onSkip={handleSkip}
              onNext={handleNext}
              onExit={() => setScreen("home")}
            />
          ) : (
            <GameScreen
              config={config}
              current={current}
              index={index}
              total={questions.length}
              score={score}
              streak={streak}
              bestStreak={bestStreak}
              selected={selected}
              answered={answered}
              isCorrect={isCorrect}
              skipped={skipped}
              peeked={peeked}
              progress={progress}
              lastAnswer={lastAnswer}
              onPeek={() => setPeeked(true)}
              onAnswer={handleAnswer}
              onSkip={handleSkip}
              onNext={handleNext}
              onExit={() => setScreen("home")}
            />
          )
        )}

        {screen === "results" && (
          <ResultsScreen
            config={config}
            score={score}
            accuracy={accuracy}
            correctCount={correctCount}
            totalUnits={totalUnits}
            bestStreak={bestStreak}
            answers={answers}
            bestScore={Math.max(bestScores[mode], score)}
            isNewBest={newBest}
            onRestart={() => startGame(mode, roundLength)}
            onHome={() => setScreen("home")}
          />
        )}
      </main>
    </div>
  );
}
