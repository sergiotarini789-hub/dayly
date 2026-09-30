"use client";

import * as React from "react";
import { Button } from "@/components/ui";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="dayly-route-error" role="alert" aria-labelledby="dayly-error-heading">
      <p className="dayly-product-eyebrow">A quiet interruption</p>
      <h1 id="dayly-error-heading">This space needs a fresh start.</h1>
      <p>Dayly could not finish this view. Your preview session is still local; try the route again when you are ready.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
