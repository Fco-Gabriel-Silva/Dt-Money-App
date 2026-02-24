import * as Yup from "yup";

export const categorySchema = Yup.object().shape({
  name: Yup.string().required("Nome da categoria é obrigatório"),
  color: Yup.string().required("Selecione uma cor"),
});
