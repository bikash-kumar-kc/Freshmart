class AuthServices {
  async requestPasswordReset({ email }: { email: string }) {
    await fetch(`${process.env.NEXT_FRESHMART_BACKEND}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
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
    await fetch(`${process.env.NEXT_FRESHMART_BACKEND}/auth/reset-password`, {
      method: "POST",
      body: JSON.stringify({ email, token, password: newPassword }),
    });
  }
}

export const authservice = new AuthServices();
