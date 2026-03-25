export default function Dodgers() {
  return (
    <>
      <p>
        A few days before launch, the client asked us to change how some of the
        data was coming in.
      </p>
      <p>
        I knew immediately it was the wrong call. The request wasn&apos;t
        unreasonable on its face - they had reasons - but changing a data
        contract days before a high-stakes launch wasn&apos;t a technical risk,
        it was a usability risk. The product would ship broken in ways that
        mattered, and we wouldn&apos;t have time to find out how.
      </p>
      <p>
        I went to my producer, Damian. He wasn&apos;t happy that we were going
        to push back on the client. He made the case anyway, and he had my back
        the whole way through. We agreed to make the API change post-launch as a
        fast-follow. The product shipped the way it was supposed to.
      </p>
      <p>
        That moment has stayed with me. The instinct to say yes to a client,
        especially close to launch, is almost overwhelming. But protecting the
        work - knowing when to hold the line - is part of the job.
      </p>

      <h2>The product</h2>
      <p>
        The Digital Trading Room was the Dodgers&apos; version of Moneyball. The
        experience had two parts: a tablet running a responsive web application,
        and a set of very large screens in the team&apos;s back office. The
        tablet was the control surface. Coaches and analysts could pull up a
        player, throw his stats on the big screen, and evaluate whether he was
        being undervalued - whether he was worth picking up.
      </p>
      <p>
        The goal was to give a baseball team a real-time analytical edge. The
        execution required something that didn&apos;t obviously exist yet: a
        data layer that could surface Bloomberg Sports&apos; player data through
        APIs a web application could actually consume.
      </p>
      <p>That was my first workstream.</p>

      <h2>The build</h2>
      <p>
        I was embedded at Bloomberg Sports for the early phase of the project.
        Their data was the engine; my job was to build the APIs our web
        applications would use to pull it. I wrote them in Ruby on Rails.
      </p>
      <p>
        I should mention: I didn&apos;t know Ruby on Rails before this project.
        I learned it specifically for this engagement - picked it up, got
        productive, and shipped production APIs in it. This is a pattern in my
        career I&apos;ve stopped apologizing for.
      </p>
      <p>
        While I was there I also wrote unit tests in RSpec - not just for the
        APIs I was building, but for significant portions of a system that had
        no test coverage at all. That work wasn&apos;t glamorous and it
        wasn&apos;t in my original scope. It needed doing.
      </p>
      <p>
        The second workstream was the web application itself: completing
        features, fixing bugs, getting the tablet experience to the state it
        needed to be for launch.
      </p>

      <h2>Three CLIOs</h2>
      <p>
        The project won three CLIOs: two bronze, for Digital and Digital
        Technique, and a silver from CLIO Sports - all for the Digital Trading
        Room itself.
      </p>
      <p>
        Awards are nice. What I think about more is the launch-day call, and
        Damian backing me up when I made it. The product shipped right.
        That&apos;s the thing that matters.
      </p>
    </>
  );
}
