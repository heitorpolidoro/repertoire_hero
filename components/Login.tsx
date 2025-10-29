import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const Login: React.FC = () => {
  const { loginWithGoogle } = useAppContext();
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const google = (window as any).google;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

    if (!clientId) {
      console.warn('[Login] Missing VITE_GOOGLE_CLIENT_ID env variable');
      return;
    }

    if (!google || !buttonRef.current) return;

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (response?.credential) {
            loginWithGoogle(response.credential);
          }
        },
        auto_select: false,
        ux_mode: 'popup',
      });

      google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        width: 240,
      });
    } catch (e) {
      console.error('Failed to initialize Google Identity Services', e);
    }
  }, [loginWithGoogle]);

  return (
    <div className="p-3 bg-gray-900 rounded-lg flex flex-col items-start">
      <div ref={buttonRef} />
    </div>
  );
};

export default Login;
