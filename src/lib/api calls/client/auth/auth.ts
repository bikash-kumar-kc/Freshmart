"use client";

export interface ISetupAccountPayload {
  email: string;
  password: string;
  isVendor: boolean;
}

class AuthServices {
  
  async createAccount(payload: ISetupAccountPayload) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRESHMART_BACKEND}/auth/setup-account`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async requestPasswordReset({ email }: { email: string }) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRESHMART_BACKEND}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) throw new Error();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async passwordReset({
    email,
    token,
    newPassword,
  }: {
    email: string;
    token: string;
    newPassword: string;
  }): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRESHMART_BACKEND}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password: newPassword }),
      },
    );
    if (!response.ok) throw new Error();
  }
}

export const authservice = new AuthServices();
