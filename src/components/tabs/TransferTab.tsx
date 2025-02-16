import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { CreateTransactionSchema } from "../../schemas/transfer";
import { tokenOptions } from "../../utils/options";

const TransferTab: React.FC = () => {
  const initialValues = {
    recipient: "",
    amount: 0,
    token: tokenOptions[0].value,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      console.log(values);
      // todo: impement transaction
      // todo: impement request to backend
    } catch (error) {
      // todo: handle error
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={CreateTransactionSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className="flex flex-col space-y-4 m-6">
            <div>
              <input
                id="recipient"
                name="recipient"
                type="text"
                placeholder="Recipient Address..."
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.recipient}
              />
              {errors.recipient && touched.recipient && (
                <p className="text-red-500 text-sm mt-1">{errors.recipient}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  id="amount"
                  name="amount"
                  type="text"
                  placeholder="Amount..."
                  className="w-full p-2 border border-gray-300 rounded"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.amount && errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
              <div className="flex-1">
                <select
                  id="token"
                  name="token"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={values.token}
                  onChange={handleChange}
                >
                  {tokenOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* todo: create ui components like button, input etc */}
            <button
              type="submit"
              className="bg-violet-700 text-white rounded py-2 hover:bg-violet-600 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Transfer
            </button>
          </Form>
        )}
      </Formik>

      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />

      <div className="w-full">
        <h3 className="text-lg font-bold mb-2 text-center">
          Transaction History
        </h3>
        TODO: airdrop/transaction history component
      </div>
    </>
  );
};

export default TransferTab;
