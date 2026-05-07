import { useState } from "react";
import { Link } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import api from "../services/api";

const programs = [
  { title: "Education", metric: "820 learners", text: "After-school support, digital access and school readiness kits." },
  { title: "Food Security", metric: "1,460 meals", text: "Community kitchens and monthly ration support for families in crisis." },
  { title: "Health Access", metric: "530 checkups", text: "Mobile camps, preventive care and referrals with local health partners." }
];

export default function Home() {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const subscribeEmail = async (event) => {
    event.preventDefault();
    setSubscribeMessage("");

    if (!subscriberEmail) {
      setSubscribeMessage("Enter an email address to subscribe.");
      return;
    }

    try {
      const res = await api.post("/notifications/subscribe", { email: subscriberEmail, topics: ["campaignUpdates", "donationAlerts", "volunteerDigest"] });
      setSubscribeMessage(res.data.message || "You are subscribed to updates.");
      setSubscriberEmail("");
    } catch (err) {
      setSubscribeMessage(err.response?.data?.message || "Unable to subscribe for updates.");
    }
  };

  return (
    <main className="site-page">
      <PublicNav />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Community-led change</span>
          <h1>Seva Foundation</h1>
          <p>
            We connect donors, volunteers and local partners to deliver education,
            food security and health support where it matters most.
          </p>
          <div className="hero-actions">
            <Link className="button-link" to="/login">Open NGO Portal</Link>
            <a className="button-link secondary-link" href="#programs">View Programs</a>
          </div>
        </div>
        <div className="hero-media">
          <img src="/ngo-hero.png" alt="Volunteers preparing community support kits" />
        </div>
      </section>

      <section id="programs" className="section-band">
        <div className="section-heading">
          <span className="eyebrow">Programs</span>
          <h2>Built around everyday dignity</h2>
        </div>
        <div className="program-grid">
          {programs.map((program) => (
            <article className="feature-card" key={program.title}>
              <span>{program.metric}</span>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="impact" className="impact-strip">
        <div><strong>2,810</strong><span>people reached</span></div>
        <div><strong>129</strong><span>active volunteers</span></div>
        <div><strong>Rs 4.02L</strong><span>funds mobilized</span></div>
        <div><strong>18</strong><span>partner locations</span></div>
      </section>

      <section id="stories" className="story-section">
        <div>
          <span className="eyebrow">Field story</span>
          <h2>A learning circle that became a neighborhood habit</h2>
          <p>
            In Hyderabad, volunteer mentors now run weekly study circles with
            children whose families asked for consistent academic support after school.
          </p>
        </div>
        <blockquote>
          "The kits helped, but the weekly attention changed the rhythm of the whole class."
          <cite>Program coordinator, Learning Without Limits</cite>
        </blockquote>
      </section>

      <section className="subscribe-section">
        <div className="section-heading">
          <span className="eyebrow">Stay in touch</span>
          <h2>Get email updates on campaigns and donor activity</h2>
        </div>
        <form className="subscribe-card" onSubmit={subscribeEmail}>
          <input
            type="email"
            placeholder="Your email address"
            value={subscriberEmail}
            onChange={(e) => setSubscriberEmail(e.target.value)}
          />
          <button type="submit">Subscribe</button>
        </form>
        {subscribeMessage && <p className="success">{subscribeMessage}</p>}
      </section>
    </main>
  );
}
