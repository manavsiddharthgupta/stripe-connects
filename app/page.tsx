'use client'
import React, { useState } from "react";
import { useStripeConnect } from "./hooks/use-stripe-connects";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function Home() {
  const [onboardingExited, setOnboardingExited] = useState(false);
  const stripeConnectInstance = useStripeConnect();

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div>
        {stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectAccountOnboarding
              onExit={() => setOnboardingExited(true)}
            />
          </ConnectComponentsProvider>
        )}
      </div>
    </div>
  );
}