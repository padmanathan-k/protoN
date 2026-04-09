import AppShell from "../components/AppShell.jsx";

const growers = [
  { name: "Eva_Adams", role: "Thoughtful grower", theme: "Healthcare", mutual: 12 },
  { name: "Karan_Mathews", role: "Seed curator", theme: "Technology", mutual: 7 },
  { name: "Riya_S", role: "Branch builder", theme: "Environment", mutual: 4 },
];

const growing = [
  { name: "Ana_River", role: "Visual storyteller", theme: "Entertainment", depth: "Daily" },
  { name: "Mo_Fern", role: "Deep discussion host", theme: "Climate", depth: "Weekly" },
  { name: "TaraJ", role: "Research-first grower", theme: "AI Ethics", depth: "Often" },
];

const Nest = () => {
  return (
    <AppShell>
      <main className="insight-shell">
        <section className="insight-hero">
          <div>
            <p className="eyebrow">Nest</p>
            <h1>Your people graph, shaped for conversations that actually keep context.</h1>
            <p>
              Growers are the people following your tree. Growing shows who you follow for insight,
              inspiration, and high-signal theme discussions.
            </p>
          </div>
          <article className="panel nest-summary-card">
            <strong>Relationship balance</strong>
            <div className="nest-balance">
              <span>Growers 128</span>
              <span>Growing 76</span>
            </div>
            <p>Most overlap happens around Technology, Sustainability, and Creator Economy.</p>
          </article>
        </section>

        <section className="nest-grid">
          <article className="panel nest-column">
            <div className="panel-heading">
              <h2>Growers</h2>
              <span>Followers who visit your branches</span>
            </div>

            <div className="nest-list">
              {growers.map((person) => (
                <article key={person.name} className="nest-person-card">
                  <div className="nest-avatar" />
                  <div>
                    <strong>{person.name}</strong>
                    <p>{person.role}</p>
                    <span>{person.theme} • {person.mutual} mutual branches</span>
                  </div>
                  <button type="button">View Tree</button>
                </article>
              ))}
            </div>
          </article>

          <article className="panel nest-column">
            <div className="panel-heading">
              <h2>Growing</h2>
              <span>People you follow closely</span>
            </div>

            <div className="nest-list">
              {growing.map((person) => (
                <article key={person.name} className="nest-person-card">
                  <div className="nest-avatar alt" />
                  <div>
                    <strong>{person.name}</strong>
                    <p>{person.role}</p>
                    <span>{person.theme} • Active {person.depth.toLowerCase()}</span>
                  </div>
                  <button type="button" className="ghost-button">Message</button>
                </article>
              ))}
            </div>
          </article>
        </section>
      </main>
    </AppShell>
  );
};

export default Nest;
