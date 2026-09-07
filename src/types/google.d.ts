declare global {
  interface GoogleCredentialResponse {
    credential: string;
    clientId?: string;
    select_by?: string;
  }

  interface GoogleAccount {
    id_token(r: GoogleCredentialResponse): void;
  }

  interface GoogleTokenClient {
    requestAccessToken(options?: { prompt?: string }): void;
    callback(r: GoogleCredentialResponse): void;
  }

  interface GoogleIdentityServices {
    initialize(options: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
      auto_select?: boolean;
    }): GoogleAccount;
    renderButton(
      parent: HTMLElement,
      options: {
        theme?: 'outline' | 'filled_blue' | 'filled_black';
        size?: 'large' | 'medium' | 'small';
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
        logo_alignment?: 'left' | 'center';
        width?: number;
      }
    ): void;
    prompt: () => void;
  }

  interface Window {
    google?: { accounts?: { id?: GoogleIdentityServices } };
  }
}

export {};