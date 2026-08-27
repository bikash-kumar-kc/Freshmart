class AuthServices {
  async requestPasswordReset(email: string) {
    await fetch(`${process.env.NEXT_FRESHMART_BACKEND}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
}

export const authservice = new AuthServices();
