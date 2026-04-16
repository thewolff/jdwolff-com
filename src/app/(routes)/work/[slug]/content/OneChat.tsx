export default function OneChat() {
  return (
    <article className="case-study">
      <section className="case-study__section">
        <h2>The Brief</h2>
        <p>
          OneChat was Airbnb&apos;s internal AI chat product - a tool used
          across the company for day-to-day productivity. By the time I joined
          the project, it hadn&apos;t had a meaningful update in years. The UI
          was dated, the architecture had accumulated debt, and a growing list
          of new features needed to be built on top of it.
        </p>
        <p>
          The ask was effectively a full frontend rebuild: modernize the look
          and feel, migrate to Airbnb&apos;s design system, integrate a separate
          chat product (GleanChat), introduce a new agents workflow, and ship a
          handful of features users had been waiting on. All while keeping the
          app running for the people who used it every day.
        </p>
      </section>

      <section className="case-study__section">
        <h2>The Hard Part</h2>
        <p>
          The most technically demanding work was porting the legacy context and
          hook architecture. The existing code had grown organically -
          reasonable decisions made in isolation that had quietly calcified into
          something brittle. Refactoring it meant understanding every assumption
          baked into those abstractions before I could safely replace them.
        </p>
        <p>
          It was harder than it sounds. Legacy code doesn&apos;t announce its
          dependencies. You pull one thread and discover three more. The goal
          wasn&apos;t just to clean it up - it was to clean it up <em>and</em>{" "}
          extend it to support new features, like the ability to toggle chat
          history off entirely. That kind of change touches everything: storage,
          state, UI feedback, edge cases you only find after users hit them.
        </p>
        <p>
          The storage migration compounded this. The app had been using
          localStorage - fast to reach for, but limited and synchronous. We
          moved to IndexedDB, which gave us the capacity and structure we needed
          for richer data, but required rethinking how the app read and wrote
          state throughout.
        </p>
      </section>

      <section className="case-study__section">
        <h2>Composability Over Configuration</h2>
        <p>
          My guiding principle on this project was composability over
          configuration. When you&apos;re rebuilding something that has to keep
          working, the temptation is to add flags - a prop here, a conditional
          there - until the component handles every case. That approach is fast
          in the short term and a maintenance problem forever.
        </p>
        <p>
          Instead, I pushed for components that did one thing well and composed
          cleanly with other components. The agents workflow is a good example:
          it introduced an entirely new interaction model with its own UI needs.
          Rather than retrofitting the existing chat components to handle it, we
          built the new workflow as a composable layer - separate concerns,
          shared primitives.
        </p>
        <p>
          The same thinking applied to context. React context gets a bad
          reputation because it&apos;s easy to misuse. We simplified the
          existing architecture by being intentional about what lived where -
          keeping contexts narrow, keeping concerns separated, and making it
          easier for the next engineer to reason about the app without holding
          the whole thing in their head at once.
        </p>
      </section>

      <section className="case-study__section">
        <h2>What We Built</h2>
        <ul className="case-study__list">
          <li>
            <strong>GleanChat integration.</strong> Merged two separate chat
            products into a single unified interface, so users no longer had to
            context-switch between tools.
          </li>
          <li>
            <strong>Agents workflow.</strong> Designed and built entirely new UI
            patterns to support a new agentic interaction mode - including state
            handling, feedback, and edge cases that had no prior precedent in
            the app.
          </li>
          <li>
            <strong>IndexedDB migration.</strong> Moved from localStorage to
            IndexedDB for more robust, structured data persistence.
          </li>
          <li>
            <strong>Editable chat output.</strong> Let users edit AI responses
            inline - a small feature with a surprisingly large surface area.
          </li>
          <li>
            <strong>Image download.</strong> A simple, clean React
            implementation for downloading images from chat. My lead commented
            on how straightforward the solution was - which, in engineering, is
            the compliment you actually want.
          </li>
          <li>
            <strong>Settings redesign.</strong> Reworked how users accessed and
            managed their settings, including the new chat history toggle.
          </li>
          <li>
            <strong>Design system migration.</strong> Replaced a collection of
            bespoke one-off components with Airbnb&apos;s design system
            components throughout - reducing visual inconsistency and future
            maintenance burden simultaneously.
          </li>
        </ul>
      </section>

      <section className="case-study__section">
        <h2>The Outcome</h2>
        <p>
          Product stakeholders were vocal about the difference. The new design
          and features landed well, and adoption increased significantly after
          launch.
        </p>
        <p>
          The part I&apos;m most proud of isn&apos;t any single feature.
          It&apos;s that the codebase we left behind was meaningfully easier to
          work in than the one we found. Clean context architecture, design
          system components, composable patterns - the kind of work that
          doesn&apos;t make it into a launch announcement but shapes every
          sprint that comes after.
        </p>
      </section>
    </article>
  );
}
