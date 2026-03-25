export default function DesignSystemsTension() {
  return (
    <>
      <p>I once talked a designer out of his own design.</p>
      <p>
        Not by going over his head, not by filing a ticket, not by
        passive-aggressively shipping something different. I pulled up the
        prototype, showed him what would happen on mobile - the jank, the
        constraint, the gap between what he&apos;d drawn and what the browser
        could actually do - and he said:{" "}
        <em>yeah, okay, let&apos;s do a full-screen modal instead.</em>
      </p>
      <p>That was it. Five minutes. Better product.</p>
      <p>That kind of conversation sounds simple. It rarely is.</p>

      <h2>The usual prescriptions</h2>
      <p>
        The designer/engineer tension in design systems is well-documented.
        Designers complain that engineers ignore specs. Engineers complain that
        designers don&apos;t understand constraints. Both are partially right,
        and the usual prescriptions follow: better documentation, shared Figma
        files, a component API with enough tokens to cover every edge case, a
        design system team to referee the middle.
      </p>
      <p>None of that is wrong, exactly. But it&apos;s treating a symptom.</p>
      <p>
        At Amazon, I was a founding member of the Meridian design system team.
        By most measures, it worked - components shipped, teams adopted them,
        the product got more consistent. But what I remember most isn&apos;t the
        system. It&apos;s that we almost never fought.
      </p>

      <h2>Structure, not culture</h2>
      <p>
        The reason was structural, not cultural. Engineering and design both
        reported up to the same design manager. An excellent one. We sat
        alongside our UX team - not in separate buildings, not in separate Slack
        channels, not in separate sprint cadences. We were just&hellip;
        together. Working on the same thing, accountable to the same person,
        with no incentive to defend territory.
      </p>
      <p>
        When I flagged that mobile modal problem, I didn&apos;t have to convince
        anyone I was right. I just had to show the thing. The designer
        wasn&apos;t invested in fighting me - he was invested in the product
        working. Because we were both invested in the same thing.
      </p>

      <h2>What that actually changes</h2>
      <p>
        <strong>Decisions are faster.</strong> When there&apos;s no org boundary
        to cross, &ldquo;we should talk about this&rdquo; happens in a hallway,
        not a meeting request. The modal conversation took five minutes because
        we could have it immediately, informally, without it becoming a process.
      </p>
      <p>
        <strong>Nobody is defending territory.</strong> When you&apos;re siloed,
        design decisions feel like design&apos;s decisions. Engineering
        decisions feel like engineering&apos;s decisions. Any change feels like
        a concession. When you&apos;re integrated, a better decision is just a
        better decision.
      </p>
      <p>
        <strong>The system serves the product, not internal politics.</strong>{" "}
        This is the quiet killer of most design systems - they calcify around
        the org chart instead of around user needs. Components get built to
        satisfy a team&apos;s scope, not a user&apos;s journey. Integrated teams
        build differently because they&apos;re optimizing for the same output.
      </p>

      <h2>The uncomfortable implication</h2>
      <p>You cannot process your way out of a bad org structure.</p>
      <p>
        I&apos;ve seen teams adopt every best practice - design tokens,
        Storybook, contribution guidelines, a governance model - and still ship
        inconsistent products, still have the same fights, still have engineers
        shipping things that don&apos;t match the comps and designers filing
        frustrated tickets about it. The tooling was fine. The org was the
        problem.
      </p>
      <p>
        If design and engineering report up different chains, they have
        different incentives. If they don&apos;t sit together, they don&apos;t
        build shared context. If decisions have to cross org boundaries, they
        slow down and get political. No component library fixes that.
      </p>
      <p>
        What fixes it is a manager who understands both disciplines, who creates
        the conditions for collaboration instead of just mandating it, and who
        makes it structurally easy for a designer and an engineer to have a
        five-minute conversation instead of a five-week process. That&apos;s not
        a tool. That&apos;s not a framework. It&apos;s leadership. And it&apos;s
        the thing that design systems articles almost never talk about, because
        it&apos;s not something you can sell.
      </p>

      <h2>What actually made Meridian work</h2>
      <p>
        My design manager at Amazon didn&apos;t make Meridian succeed by picking
        the right technology stack. He made it succeed by making sure the people
        building it trusted each other - and gave them the proximity and shared
        ownership to make that trust practical.
      </p>
      <p>
        The next time your design system is struggling, before you buy another
        tool or write another contribution guide: ask who everyone reports to,
        and how often they eat lunch together.
      </p>
      <p>The answer will tell you more than the docs ever could.</p>
    </>
  );
}
