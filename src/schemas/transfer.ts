import * as yup from "yup";
import { tokenOptions } from "../utils/options";

const validTokens = tokenOptions.map((opt) => opt.value);

export const CreateTransactionSchema = yup.object().shape({
  recipient: yup.string().trim().required("Recipient address is required"),
  amount: yup
    .number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  token: yup.string().oneOf(validTokens, "Invalid token").required(),
});
