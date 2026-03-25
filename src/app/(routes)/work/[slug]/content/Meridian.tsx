export default function Meridian() {
  return (
    <>
      <p>
        Before Meridian, every team at Amazon was building their own button.
      </p>
      <p>
        Not metaphorically - literally. Designers across the org were solving
        the same problems independently, arriving at slightly different answers
        each time. A button here, a form element there, a modal that almost
        matched the one two teams over. The visual language of our products was
        fractured, and the cost was everywhere: in designer hours, in
        engineering rework, in the inconsistent experience users encountered as
        they moved through our products.
      </p>
      <p>Meridian was built to fix that.</p>

      <h2>Founding the team</h2>
      <p>
        I joined as a founding member of the engineering team, one of three
        Design Technologists who would form the core of what Meridian became. We
        were prototypers by background - we knew how to build things fast, how
        to think in components, how to collaborate with design. What we
        didn&apos;t know was how to run a production engineering team.
      </p>
      <p>
        We didn&apos;t have an on-call rotation. We didn&apos;t have SLAs or
        response time commitments. We didn&apos;t have a plan for customer
        feedback. We&apos;d never had to think about what a sev2 meant to a
        frontend team that didn&apos;t own a service.
      </p>
      <p>
        My role split in two directions. The first was technical: I owned some
        of the most complex components in the system - modals, bottom sheets,
        the kinds of interactive elements where focus management and keyboard
        behavior and responsive layout all have to work together, and where the
        failure modes are user-facing and obvious.
      </p>
      <p>
        The second was operational. I spearheaded defining what engineering
        excellence meant for our team: on-call rotations, severity definitions,
        customer feedback loops, response time commitments. We were building
        infrastructure that other teams would depend on. We needed to operate
        like it.
      </p>

      <h2>Launch day</h2>
      <p>We learned that lesson the hard way, and I wouldn&apos;t trade it.</p>
      <p>
        Launch day. We were at a bar, celebrating. And then a sev2 hit - an
        unrelated segfault, escalated all the way to our design director. We
        left the bar and went back to the office and fixed it together.
      </p>
      <p>
        From that night on, on-call wasn&apos;t an abstract concept. We
        understood viscerally what it meant for other teams to depend on what we
        built, and what it cost when we weren&apos;t ready. We built the
        rotation the next week.
      </p>

      <h2>What Meridian became</h2>
      <p>
        Meridian was originally scoped to our org. It didn&apos;t stay there.
      </p>
      <p>
        The last time I checked - and this was several years ago - there were
        over 800 projects using Meridian to build their applications. Teams
        we&apos;d never spoken to had adopted it. It had become infrastructure
        in a way we hadn&apos;t anticipated when we started, which is maybe the
        best thing a design system can do: become invisible, become assumed,
        become the foundation other people build on without thinking about it.
      </p>
      <p>That&apos;s what we built. I&apos;m proud of it.</p>
    </>
  );
}
