"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Input, Progress, RadioGroup, RadioItem, Select } from "@/components/ui";

const steps = ["Welcome", "Planning context", "Your profile", "First task"] as const;

export function OnboardingExperience() {
  const [step, setStep] = React.useState(0);
  const [displayName, setDisplayName] = React.useState("");
  const [timeZone, setTimeZone] = React.useState("local");
  const [availability, setAvailability] = React.useState("standard");
  const [planningStyle, setPlanningStyle] = React.useState("balanced");
  const [firstTask, setFirstTask] = React.useState("");
  const [message, setMessage] = React.useState("Choose what feels useful; optional setup can wait.");

  function goToToday() {
    const params = new URLSearchParams();
    const task = firstTask.trim();
    if (task) params.set("firstTask", task);
    if (displayName.trim()) params.set("name", displayName.trim());
    if (timeZone) params.set("timeZone", timeZone);
    if (availability) params.set("availability", availability);
    if (planningStyle) params.set("planningStyle", planningStyle);
    const query = params.toString();
    window.location.href = query ? `/today?${query}` : "/today";
  }

  function continueStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      setMessage("Saved for this setup session. You can change it later.");
      return;
    }
    goToToday();
  }

  function goBack() {
    if (step === 0) {
      window.location.href = "/";
      return;
    }
    setStep((current) => current - 1);
  }

  return (
    <main className="dayly-onboarding" aria-labelledby="onboarding-heading">
      <div className="dayly-onboarding__shell">
        <header className="dayly-onboarding__topbar">
          <Link className="dayly-onboarding__brand" href="/" aria-label="Dayly home"><span className="dayly-sidebar__mark" aria-hidden="true">D</span><span>Dayly</span></Link>
          <Link className="dayly-product-text-link" href="/">Back to Today</Link>
        </header>

        <div className="dayly-onboarding__layout">
          <section className="dayly-onboarding__intro">
            <p className="dayly-product-eyebrow">Personal setup</p>
            <h1 id="onboarding-heading">Set up a day that fits you.</h1>
            <p>Dayly starts with the minimum context needed to make Today useful. Nothing here requires a connection or a perfect plan.</p>
            <div className="dayly-onboarding__signal" aria-hidden="true"><span /> <span /> <span /></div>
          </section>

          <section className="dayly-onboarding__workspace" aria-label="Dayly setup">
            <div className="dayly-onboarding__progress" aria-label={`Onboarding step ${step + 1} of ${steps.length}`}>
              <div className="dayly-onboarding__progress-heading"><span>Step {String(step + 1).padStart(2, "0")}</span><strong>{steps[step]}</strong></div>
              <Progress value={step + 1} max={steps.length} label={`Step ${step + 1} of ${steps.length}`} />
              <ol>{steps.map((label, index) => <li key={label} data-current={index === step || undefined} aria-current={index === step ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{label}</li>)}</ol>
            </div>

            <form className="dayly-onboarding__form" onSubmit={continueStep}>
              {step === 0 ? (
                <section aria-labelledby="welcome-step-heading">
                  <p className="dayly-product-eyebrow">Begin here</p>
                  <h2 id="welcome-step-heading">Understand the day, then choose what matters.</h2>
                  <p className="dayly-onboarding__hint">Dayly is a calm planning surface for seeing what is next, making room for it, and starting one useful action.</p>
                  <ul className="dayly-onboarding__principles">
                    <li>Capture before you organize.</li>
                    <li>Keep commitments and flexible work distinct.</li>
                    <li>Adjust the plan when the day changes.</li>
                  </ul>
                </section>
              ) : null}
              {step === 1 ? (
                <section aria-labelledby="planning-step-heading">
                  <p className="dayly-product-eyebrow">Your rhythm</p>
                  <h2 id="planning-step-heading">Give Today some context.</h2>
                  <p className="dayly-onboarding__hint">These are planning preferences, not commitments. You can revise them in Settings later.</p>
                  <div className="dayly-onboarding__fields">
                    <Select label="Time zone" value={timeZone} onChange={(event) => setTimeZone(event.target.value)} options={[{ value: "local", label: "Use my local time zone" }, { value: "utc", label: "UTC" }]} />
                    <Select label="Typical availability" value={availability} onChange={(event) => setAvailability(event.target.value)} options={[{ value: "standard", label: "A standard workday" }, { value: "flexible", label: "Flexible or changing" }, { value: "unknown", label: "I am not sure yet" }]} />
                    <RadioGroup name="planning-style" value={planningStyle} onValueChange={setPlanningStyle} aria-label="Planning style">
                      <RadioItem value="balanced" label="Balanced day" description="Keep room for both commitments and flexible work." />
                      <RadioItem value="gentle" label="Gentle start" description="Begin with one clear priority and add context later." />
                      <RadioItem value="deep" label="Deep work first" description="Protect an early block for focused work when possible." />
                    </RadioGroup>
                  </div>
                </section>
              ) : null}
              {step === 2 ? (
                <section aria-labelledby="profile-step-heading">
                  <p className="dayly-product-eyebrow">A little about you</p>
                  <h2 id="profile-step-heading">Make the space feel like yours.</h2>
                  <p className="dayly-onboarding__hint">Optional. Keep this personal without creating a social profile.</p>
                  <Input id="onboarding-name" label="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Your name" description="You can skip this and add it later." />
                </section>
              ) : null}
              {step === 3 ? (
                <section aria-labelledby="task-step-heading">
                  <p className="dayly-product-eyebrow">One useful beginning</p>
                  <h2 id="task-step-heading">What would make today useful?</h2>
                  <p className="dayly-onboarding__hint">Add one first task or choose “Do this later.” A title is enough.</p>
                  <Input id="onboarding-first-task" label="First task" value={firstTask} onChange={(event) => setFirstTask(event.target.value)} placeholder="A small, useful next step" description="This preview keeps the value in memory only." />
                </section>
              ) : null}
              <p className="dayly-onboarding__message" role="status" aria-live="polite">{message}</p>
              <div className="dayly-onboarding__actions">
                <Button type="button" variant="ghost" onClick={goBack}>{step === 0 ? "Back to Today" : "Back"}</Button>
                {step === steps.length - 1 ? <><Button type="button" variant="ghost" onClick={goToToday}>Do this later</Button><Button type="submit">Go to Today</Button></> : <Button type="submit">Continue</Button>}
              </div>
            </form>
            <p className="dayly-onboarding__disclosure">Preview setup is intentionally local and temporary. No account, integration, API, or persistent record is created.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
