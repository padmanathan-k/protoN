import AppShell from "../components/AppShell.jsx";

const contributionRows = [
  [1, 2, 0, 3, 4, 2, 1, 0, 3, 2, 1, 4],
  [0, 1, 3, 2, 2, 4, 1, 1, 0, 2, 3, 4],
  [2, 2, 4, 1, 0, 3, 4, 2, 1, 0, 1, 2],
  [1, 0, 2, 4, 3, 2, 1, 4, 2, 3, 0, 1],
  [4, 2, 1, 0, 2, 3, 4, 1, 2, 4, 3, 2],
  [2, 3, 0, 1, 4, 2, 2, 3, 1, 0, 4, 3],
  [1, 4, 2, 3, 1, 0, 2, 4, 3, 2, 1, 0],
];

const stats = [
  { label: "Growth streak", value: "19 days", meta: "3 reeds or seeds each day" },
  { label: "Seeds planted", value: "28", meta: "Across 6 active themes" },
  { label: "Branches grown", value: "143", meta: "Reeds across your tree" },
  { label: "Media stories", value: "12", meta: "Image, reel, and voice-rich seeds" },
];

const milestones = [
  { title: "Theme Sprinter", detail: "Created seeds in 5 themes this month", tone: "gold" },
  { title: "Deep Root", detail: "One thread grew past 4 reed levels", tone: "pink" },
  { title: "Helpful Grower", detail: "Top 10% by upvotes in Technology", tone: "green" },
];

const Growth = () => {
  return (
    <AppShell>
      <main className="insight-shell">
        <section className="insight-hero">
          <div>
            <p className="eyebrow">My Growth</p>
            <h1>Contribution rhythm that feels like progress, not pressure.</h1>
            <p>
              Track how consistently you seed ideas, grow branches, and contribute meaningful reeds
              across your favorite themes.
            </p>
          </div>
          <div className="hero-badge-stack">
            {milestones.map((milestone) => (
              <article key={milestone.title} className={`milestone-card ${milestone.tone}`}>
                <strong>{milestone.title}</strong>
                <span>{milestone.detail}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stats-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.meta}</p>
            </article>
          ))}
        </section>

        <section className="growth-grid">
          <article className="panel contribution-panel">
            <div className="panel-heading">
              <h2>Contribution Garden</h2>
              <span>Last 12 weeks</span>
            </div>

            <div className="contribution-map">
              {contributionRows.flatMap((row, rowIndex) =>
                row.map((value, columnIndex) => (
                  <span
                    key={`${rowIndex}-${columnIndex}`}
                    className={`contribution-cell level-${value}`}
                    title={`Week ${columnIndex + 1}, row ${rowIndex + 1}`}
                  />
                ))
              )}
            </div>

            <div className="map-legend">
              <span>Light</span>
              <div className="legend-scale">
                <span className="contribution-cell level-0" />
                <span className="contribution-cell level-1" />
                <span className="contribution-cell level-2" />
                <span className="contribution-cell level-3" />
                <span className="contribution-cell level-4" />
              </div>
              <span>Dense</span>
            </div>
          </article>

          <article className="panel trend-panel">
            <div className="panel-heading">
              <h2>Weekly Pulse</h2>
              <span>Most active spaces</span>
            </div>

            <div className="pulse-list">
              {[
                { theme: "Technology", value: 82 },
                { theme: "Environment", value: 63 },
                { theme: "Healthcare", value: 44 },
                { theme: "Entertainment", value: 35 },
              ].map((item) => (
                <div key={item.theme} className="pulse-row">
                  <div>
                    <strong>{item.theme}</strong>
                    <span>{item.value} interactions</span>
                  </div>
                  <div className="pulse-bar">
                    <span style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </AppShell>
  );
};

export default Growth;
