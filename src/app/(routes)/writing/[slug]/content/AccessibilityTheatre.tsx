export default function AccessibilityTheatre() {
  return (
    <>
      <p>
        We built a combobox. It looked right. It had the right visual
        affordances, the right hover states, the right animations. It passed our
        linter. It shipped in our design system, which meant it shipped
        everywhere.
      </p>
      <p>
        Months later, an accessibility audit told us the truth: for most users
        who relied on assistive technology, it was effectively unusable.
      </p>
      <p>
        Keyboard navigation was barely there. Focus behavior was erratic. Screen
        reader announcements were either absent or nonsensical - the kind of
        output that tells a user nothing about where they are, what&apos;s
        selected, or what just changed.
      </p>
      <p>
        We had built a combobox that worked great if you could see it and use a
        mouse. For everyone else, we had built a wall.
      </p>

      <h2>What theatre actually means</h2>
      <p>
        This is accessibility theatre. And I want to be precise about what I
        mean by that, because it&apos;s not an accusation I level at bad actors.
        I was on the team. We cared about quality. We were building a design
        system at Amazon, with real resources and real process. We still got it
        wrong.
      </p>
      <p>
        Theatre isn&apos;t malice. It&apos;s assumption. It&apos;s building
        something that looks accessible - that has ARIA attributes and semantic
        HTML and passes automated checks - and never actually testing whether it
        works for the people those things are supposed to help. It&apos;s the
        difference between putting a ramp on a building and checking whether the
        ramp goes anywhere.
      </p>
      <p>
        The uncomfortable truth is that most teams never get past theatre, not
        because they don&apos;t care, but because the feedback loop is broken.
        Visual testing is immediate. If something looks wrong, you see it.
        Assistive technology testing requires deliberate effort - running a
        screen reader, navigating by keyboard only, testing with real users if
        you can - and most teams skip it, or defer it, or assume the linter is
        enough.
      </p>
      <p>
        The linter is not enough. Automated tools catch only a fraction of
        accessibility issues. The rest require human judgment and actual
        testing.
      </p>

      <h2>Why comboboxes are where accessibility goes to die</h2>
      <p>
        I say this as someone who has now built one correctly, and it was
        humbling.
      </p>
      <p>
        The ARIA authoring practices spec for a combobox is long, specific, and
        unforgiving. You need to manage focus explicitly - where does it go when
        the listbox opens? When an option is highlighted? When the user
        dismisses without selecting? You need announcements for every meaningful
        state change: the listbox opening, the number of results, which option
        is active, what was selected. You need keyboard behavior that follows
        patterns screen reader users have internalized - arrow keys to navigate,
        Enter to select, Escape to dismiss, Home and End to jump to boundaries.
      </p>
      <p>
        None of this is communicated by visual design. A combobox that looks
        identical to a compliant one can be completely opaque to a screen reader
        user. That&apos;s what we&apos;d built.
      </p>
      <p>
        What the rebuild actually took: reading the spec carefully, testing with
        VoiceOver and NVDA throughout (not at the end), and building the
        keyboard and focus behavior first - before the visual layer - so I
        couldn&apos;t fool myself into thinking it worked because it looked
        right.
      </p>
      <p>
        The result was a component that announced its state clearly, that a
        keyboard user could navigate without losing their place, that a screen
        reader user could actually understand and operate. It took longer. It
        was worth it.
      </p>

      <h2>You don&apos;t know what you&apos;ve built</h2>
      <p>
        If you haven&apos;t tested your interactive components with a real
        screen reader and keyboard-only navigation, you don&apos;t know what
        you&apos;ve built.
      </p>
      <p>
        Not &ldquo;you probably have some issues.&rdquo; You{" "}
        <em>don&apos;t know.</em> The visual surface tells you nothing about the
        experience of someone who can&apos;t use it that way. You need to go
        find out.
      </p>
      <p>
        Run VoiceOver on macOS. Tab through your forms. Turn off your mouse for
        an hour. Hire a disabled user to test with you if you can. Get an audit.
        Do <em>something</em> that puts you on the other side of your own
        interface.
      </p>
      <p>
        Accessibility theatre is comfortable. It lets you check a box and move
        on. What it doesn&apos;t do is let the person who needed that combobox
        to actually use your product.
      </p>
      <p>
        I know because I built the wall. I also know what it took to tear it
        down. The second experience is better - but the first one is the one I
        think about.
      </p>
    </>
  );
}
