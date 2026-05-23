import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "tiny-wins:v2";
const LEGACY_STORAGE_KEY = "small-wins-log:v2";

const CATEGORIES = ["creative", "work", "life", "health", "learning", "relationships"];

const CAT_COLORS = {
  creative: "#f0e6ff",
  work: "#e6f0ff",
  life: "#e6fff0",
  health: "#fff0e6",
  learning: "#ffffe6",
  relationships: "#ffe6f0",
};

const CAT_TEXT = {
  creative: "#7c3aed",
  work: "#2563eb",
  life: "#16a34a",
  health: "#ea580c",
  learning: "#ca8a04",
  relationships: "#db2777",
};

const GRID_COLUMNS = 7;
const EMPTY_CELL = "#d8dce2";

const FONT = "'Space Grotesk', sans-serif";
const BG = "#f5f6f8";
const TEXT = "#0e0e0e";
const PLACEHOLDER = "#adadad";
const MUTED = "#999";

function localDayKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

function build365DayCells(wins) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells = [];
  for (let i = 0; i < 365; i++) {
    const cellDate = new Date(today);
    cellDate.setDate(cellDate.getDate() - (364 - i));
    const key = localDayKey(cellDate);
    const dayWins = wins.filter((w) => localDayKey(w.date) === key);
    dayWins.sort((a, b) => new Date(b.date) - new Date(a.date));
    const top = dayWins[0];
    cells.push({
      cellDate,
      dayKey: key,
      category: top ? top.category : null,
      count: dayWins.length,
      wins: dayWins,
    });
  }
  return cells;
}

function Logo() {
  return (
    <img
      src="/assets/tiny-wins-logo.png"
      alt="tiny wins"
      width={134}
      height={63}
      style={{ display: "block", imageRendering: "pixelated" }}
    />
  );
}

function PenIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M12.2 2.8L15.2 5.8L6.5 14.5H3.5V11.5L12.2 2.8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10.8 4.2L13.8 7.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 3.5C5.96 3.5 3.5 5.96 3.5 9C3.5 12.04 5.96 14.5 9 14.5C12.04 14.5 14.5 12.04 14.5 9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M3.5 3.5V6.5H6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 6.5V9L11 10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOGGLE_ACTIVE = "#243f7a";

function SegmentedToggle({ value, onChange, options, ariaLabel, width = 132 }) {
  const activeIndex = Math.max(0, options.findIndex((o) => o.id === value));
  const pad = 5;
  const count = options.length;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{
        position: "relative",
        display: "flex",
        width,
        padding: pad,
        borderRadius: 18,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: pad,
          bottom: pad,
          left: pad,
          width: `calc((100% - ${pad * 2}px) / ${count})`,
          borderRadius: 14,
          background: TOGGLE_ACTIVE,
          boxShadow: "0 4px 16px rgba(36, 63, 122, 0.28)",
          transform: `translateX(${activeIndex * 100}%)`,
          transition: "transform 0.22s ease",
        }}
      />
      {options.map(({ id, label, Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={label}
            title={label}
            onClick={() => onChange(id)}
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              height: 36,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon color={active ? "#fff" : MUTED} />
          </button>
        );
      })}
    </div>
  );
}

function BottomToggle({ page, onChange }) {
  return (
    <nav
      aria-label="App sections"
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        zIndex: 50,
        width: "100%",
        maxWidth: 375,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        <SegmentedToggle
          value={page}
          onChange={onChange}
          ariaLabel="App sections"
          options={[
            { id: "log", label: "Log a win", Icon: PenIcon },
            { id: "wins", label: "Past wins", Icon: HistoryIcon },
          ]}
        />
      </div>
    </nav>
  );
}

function ListIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="14" height="1.5" rx="0.75" fill={color} />
      <rect x="2" y="8.25" width="14" height="1.5" rx="0.75" fill={color} />
      <rect x="2" y="12.5" width="14" height="1.5" rx="0.75" fill={color} />
    </svg>
  );
}

function GridIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={2 + col * 5}
            y={2 + row * 5}
            width="3"
            height="3"
            rx="0.75"
            fill={color}
          />
        ))
      )}
    </svg>
  );
}

function ViewToggle({ view, onChange }) {
  const isList = view === "list";
  const nextView = isList ? "grid" : "list";
  const label = isList ? "Switch to grid view" : "Switch to list view";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: 24,
        marginBottom: 24,
      }}
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => onChange(nextView)}
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          border: "none",
          background: TOGGLE_ACTIVE,
          boxShadow: "0 4px 16px rgba(36, 63, 122, 0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {isList ? <GridIcon color="#fff" /> : <ListIcon color="#fff" />}
      </button>
    </div>
  );
}

function WinsList({ grouped }) {
  return (
    <>
      {Object.keys(grouped)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => (
          <div key={year}>
            <p
              style={{
                fontSize: 11,
                color: PLACEHOLDER,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
                fontFamily: FONT,
              }}
            >
              {year}
            </p>
            {Object.keys(grouped[year])
              .sort((ma, mb) => {
                const ta = Math.min(...grouped[year][ma].map((w) => new Date(w.date).getTime()));
                const tb = Math.min(...grouped[year][mb].map((w) => new Date(w.date).getTime()));
                return tb - ta;
              })
              .map((month) => (
                <div key={month} style={{ marginBottom: 32 }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: MUTED,
                      marginBottom: 12,
                      paddingLeft: 12,
                      borderLeft: `2px solid ${PLACEHOLDER}`,
                      fontFamily: FONT,
                    }}
                  >
                    {month}
                  </p>
                  {grouped[year][month].map((w) => (
                    <div
                      key={w.id}
                      style={{
                        paddingLeft: 24,
                        marginBottom: 14,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          background: CAT_COLORS[w.category],
                          color: CAT_TEXT[w.category],
                          whiteSpace: "nowrap",
                          marginTop: 2,
                          fontFamily: FONT,
                        }}
                      >
                        {w.category}
                      </span>
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.5,
                          margin: 0,
                          color: TEXT,
                          fontFamily: FONT,
                        }}
                      >
                        {w.text}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ))}
    </>
  );
}

function DayWinOverlay({ cell, onClose }) {
  const dateLabel = cell.cellDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Wins for ${dateLabel}`}
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(245, 246, 248, 0.88)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 5,
        borderRadius: 8,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 280,
          background: "#fff",
          borderRadius: 16,
          padding: "18px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 12,
            color: MUTED,
            fontFamily: FONT,
            textAlign: "center",
          }}
        >
          {dateLabel}
        </p>
        {cell.wins.length === 0 ? (
          <p
            style={{
              margin: 0,
              textAlign: "center",
              color: PLACEHOLDER,
              fontFamily: FONT,
              fontSize: 15,
            }}
          >
            no wins logged
          </p>
        ) : (
          cell.wins.map((w) => (
            <div
              key={w.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  background: CAT_COLORS[w.category],
                  color: CAT_TEXT[w.category],
                  whiteSpace: "nowrap",
                  marginTop: 2,
                  fontFamily: FONT,
                }}
              >
                {w.category}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: TEXT,
                  fontFamily: FONT,
                }}
              >
                {w.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function YearDotGrid({ wins }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellSize, setCellSize] = useState(0);
  const gridRef = useRef(null);
  const cells = useMemo(() => build365DayCells(wins), [wins]);

  useLayoutEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const update = () => {
      const width = node.clientWidth;
      if (width > 0) setCellSize(width / GRID_COLUMNS);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ marginBottom: 28, width: "100%" }}>
      <p
        style={{
          fontSize: 11,
          color: PLACEHOLDER,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 12,
          fontFamily: FONT,
        }}
      >
        2k26
      </p>
      <div ref={gridRef} style={{ position: "relative", width: "100%" }}>
        {cellSize > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${cellSize}px)`,
              gridAutoRows: `${cellSize}px`,
              gap: 0,
              width: cellSize * GRID_COLUMNS,
              maxWidth: "100%",
            }}
          >
            {cells.map((cell) => {
              const logged = cell.count > 0 && cell.category;
              const fill = logged ? CAT_COLORS[cell.category] : EMPTY_CELL;
              const dateShort = cell.cellDate.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });

              return (
                <button
                  key={cell.dayKey}
                  type="button"
                  aria-label={
                    logged
                      ? `${dateShort}, ${cell.count} win${cell.count > 1 ? "s" : ""}`
                      : `${dateShort}, no wins`
                  }
                  onClick={() => setSelectedCell(cell)}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    padding: 0,
                    border: "none",
                    background: fill,
                    boxShadow: logged ? `inset 0 0 0 1px ${CAT_TEXT[cell.category]}` : "none",
                    outline: `1px solid ${BG}`,
                    outlineOffset: -1,
                    borderRadius: 0,
                    cursor: "pointer",
                    display: "block",
                  }}
                />
              );
            })}
          </div>
        )}
        {selectedCell && <DayWinOverlay cell={selectedCell} onClose={() => setSelectedCell(null)} />}
      </div>
    </div>
  );
}

function groupByDate(wins) {
  const grouped = {};
  wins.forEach((w) => {
    const d = new Date(w.date);
    const year = d.getFullYear();
    const month = d.toLocaleString("default", { month: "long" });
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(w);
  });
  return grouped;
}

const SEED = [
  { id: 1, text: "shipped the zine portfolio", category: "creative", date: new Date(2026, 2, 15).toISOString() },
  { id: 2, text: "wrote the first substack post", category: "creative", date: new Date(2026, 3, 1).toISOString() },
  { id: 3, text: "actually went for a walk", category: "health", date: new Date(2026, 3, 5).toISOString() },
];

function loadWins() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

function CategoryPicker({ onPick, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14, 14, 14, 0.25)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 16px 40px",
        zIndex: 10,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 375,
          background: "#fff",
          borderRadius: 16,
          padding: "20px 16px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            color: MUTED,
            fontFamily: FONT,
            textAlign: "center",
          }}
        >
          pick a category
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onPick(c)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                fontSize: 13,
                border: `1px solid ${CAT_TEXT[c]}`,
                background: CAT_COLORS[c],
                color: CAT_TEXT[c],
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TinyWins() {
  const [page, setPage] = useState("log");
  const [loggedView, setLoggedView] = useState("list");
  const [wins, setWins] = useState(loadWins);
  const [text, setText] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, [wins]);

  useEffect(() => {
    if (page === "log") {
      inputRef.current?.focus();
    }
  }, [page]);

  function handleSubmit(category) {
    if (!text.trim()) return;
    setWins((prev) => [
      ...prev,
      { id: Date.now(), text: text.trim(), category, date: new Date().toISOString() },
    ]);
    setText("");
    setShowCategories(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1500);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && text.trim()) {
      e.preventDefault();
      setShowCategories(true);
    }
  }

  const placeholder = inputFocused ? "" : submitted ? "logged ✓" : "what did you conquer today?";

  const grouped = groupByDate([...wins].reverse());

  const shellStyle = {
    fontFamily: FONT,
    maxWidth: 375,
    width: "100%",
    height: "100%",
    margin: "0 auto",
    background: BG,
    color: TEXT,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    paddingBottom: "calc(72px + env(safe-area-inset-bottom))",
  };

  return (
    <div style={shellStyle}>
      {page === "log" && (
        <div style={{ paddingTop: 57, paddingBottom: 16, flexShrink: 0, display: "flex", justifyContent: "center" }}>
          <Logo />
        </div>
      )}

      {page === "log" ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            aria-label="Log your win"
            style={{
              width: "100%",
              maxWidth: 343,
              border: "none",
              background: "transparent",
              resize: "none",
              outline: "none",
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.3,
              textAlign: "center",
              color: TEXT,
              caretColor: TEXT,
              padding: 0,
            }}
          />
        </div>
      ) : (
        <div style={{ padding: "0 20px 8px", flex: 1, minHeight: 0, overflow: "auto" }}>
          <ViewToggle view={loggedView} onChange={setLoggedView} />
          {loggedView === "grid" ? <YearDotGrid wins={wins} /> : <WinsList grouped={grouped} />}
        </div>
      )}

      {showCategories && (
        <CategoryPicker onPick={handleSubmit} onCancel={() => setShowCategories(false)} />
      )}

      <BottomToggle page={page} onChange={setPage} />

      <style>{`
        textarea::placeholder {
          color: ${submitted && !inputFocused ? TEXT : PLACEHOLDER};
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
