import * as Yup from "yup";

export const categorySchema = Yup.object().shape({
  id: Yup.lazy((value) =>
    typeof value === "number"
      ? Yup.number().required()
      : Yup.string().required(),
  ),
  name: Yup.string().required("Nome da categoria é obrigatório"),
  color: Yup.string().required("Selecione uma cor"),
  userId: Yup.number().required(),
});
