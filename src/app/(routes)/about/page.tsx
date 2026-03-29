import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fifteen years in frontend. Formerly Amazon. English major first, engineer second.",
  alternates: {
    canonical: "https://jdwolff.com/about",
  },
  openGraph: {
    images: [
      {
        url: "/og?eyebrow=About&title=English+major.+Self-taught+engineer.+Fifteen+years+in.",
      },
    ],
  },
};

export default function About() {
  return (
    <PageLayout
      eyebrow="About"
      title="English major. Self-taught engineer. Fifteen years in."
      intro="The longer version."
    >
      <article className={styles.article}>
        <p>
          I didn&apos;t study computer science. I studied English - creative
          writing, Romantic poetry, linguistics. I graduated with a head full of
          Blake and a vague plan to figure the rest out later.
        </p>
        <p>
          The rest turned out to be software engineering. A very small ad agency
          took a chance on me, handed me a pile of PHP, HTML, CSS, and jQuery,
          and said good luck. I taught myself everything. Late nights, bad Stack
          Overflow answers, a lot of breaking things and fixing them.
          That&apos;s still how I learn.
        </p>
        <p>
          I&apos;ve never been ashamed of that origin story. If anything, I
          think it made me better. Engineers who came up through CS programs
          learned to think like computers. I learned to think like a reader -
          like someone who needs to understand something quickly, feel
          something, be moved to act. That turns out to be pretty useful when
          you&apos;re building interfaces.
        </p>

        <h2>Amazon, and the end of imposter syndrome</h2>
        <p>
          Seven years at Amazon. I was a founding member of the Meridian design
          system team - one of the best things I&apos;ve ever worked on.
          Building the foundation that hundreds of teams ship on top of is a
          different kind of engineering. You&apos;re not building features.
          You&apos;re building trust. You&apos;re building constraints that feel
          like freedom.
        </p>
        <p>
          Amazon is also where I finally stopped feeling like a fraud. Not
          because someone told me I belonged - but because I just kept
          shipping,&nbsp; kept solving hard problems, kept being in rooms with
          brilliant people and holding my own. Seven years of that will do it.
        </p>

        <h2>The thing about winning a CLIO</h2>
        <p>
          In 2015 I helped build the LA Dodgers Digital Trading Room -&nbsp;a
          real-time web application running on a 10,000px-wide Chrome instance,
          visualizing live data during the MLB trade deadline. Every tech person
          we talked to said it couldn&apos;t be done, at least not as a web app.
          We did it anyway. Then we won a CLIO Award for it.
        </p>
        <p>
          That was the first time I understood what validation actually feels
          like. Not the imposter-syndrome-relief kind - the real kind, where you
          did something genuinely hard and it got recognized. I think about that
          project whenever someone tells me the web can&apos;t do something.
        </p>

        <h2>Why accessibility</h2>
        <p>
          Because it&apos;s a justice issue, and I don&apos;t know how to care
          about justice selectively. Too many engineers treat accessibility as a
          compliance checkbox - something you bolt on at the end when legal gets
          nervous. I think that&apos;s exactly backwards. Accessible code is
          better code. Accessible design is better design. And the web is a
          public space; everyone deserves to move through it with dignity.
        </p>
        <p>
          That&apos;s not a philosophy I arrived at in the abstract. It came
          from years of watching real people struggle with real interfaces that
          engineers just didn&apos;t think about. I think about them now.
        </p>

        <h2>The rest of it</h2>
        <p>
          I have a tattoo sleeve of Bill Murray portraits. I dye my hair. I am
          extremely online. I&apos;m odd, queer, and try very hard to make the
          spaces I&apos;m in more inclusive than I found them.
        </p>
        <p>
          I believe kindness and high standards aren&apos;t in conflict. I
          believe the best work happens when people feel safe enough to say
          &quot;I don&apos;t know.&quot; I believe the web is still one of the
          most interesting places to build things, fifteen years in.
        </p>
        <p>
          Also — if you&apos;re the kind of person who opens DevTools before
          you read the copy, there might be something here for you.
        </p>
        <p>
          If any of that sounds like someone you want on your team —&nbsp;
          <a href="/contact">let&apos;s talk</a>.
        </p>
      </article>
    </PageLayout>
  );
}
