'use client'
import { useState, useEffect } from "react";
import { loadConnectAndInitialize, StripeConnectInstance } from "@stripe/connect-js";
import { useSearchParams } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

export const useStripeConnect = () => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance>();
  const searchParams = useSearchParams();
  const token = searchParams.get('jwt');

  useEffect(() => {
    const initializeStripeConnect = async () => {
      try {
        if (!token) {
          console.warn('No JWT token found');
          return;
        }

        let decoded;
        try {
          decoded = jwtDecode(token) as { client_secret?: string };
        } catch (decodeError) {
          console.error('Invalid JWT token', decodeError);
          return;
        }

        const clientSecret = decoded?.client_secret;
        if (!clientSecret) {
          console.error('No client secret found in JWT');
          return;
        }

        const fetchClientSecret = async () => clientSecret;

        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          throw new Error('Stripe publishable key is not configured');
        }

        const connectInstance = loadConnectAndInitialize({
          publishableKey,
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#635BFF",
            },
          },
        });

        setStripeConnectInstance(connectInstance);
      } catch (error) {
        console.error('Failed to initialize Stripe Connect', error);
        setStripeConnectInstance(undefined);
      }
    };

    initializeStripeConnect();
  }, [token]);

  return stripeConnectInstance;
};

export default useStripeConnect;