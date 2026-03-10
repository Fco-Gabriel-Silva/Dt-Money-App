import * as yup from "yup";

export const userSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email("E-mail inválido"),
  password: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  phone: yup.string().min(11, "Telefone inválido"),
});
