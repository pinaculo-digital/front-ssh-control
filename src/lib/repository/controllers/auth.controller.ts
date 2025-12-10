import z from "zod";
import api from "../api";

export class AuthController {
  async login(data: SignIn): Promise<ResponseAuth> {
    return await api.post("/auth/login", data);
  }
}

export const SignInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, { error: "Senha obrigatória" }),
});

export type SignIn = z.infer<typeof SignInSchema>;

export type ResponseAuth = {
  token: string;
};
