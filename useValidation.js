import { reactive } from "@nuxt/composition-api";
import isEmpty from "lodash/isEmpty";

export const useValidation = (FieldsConstructor) => {
  const validation = reactive({ ...new FieldsConstructor() });

  const initValidation = () => {
    for (const [key] of Object.entries(validation)) {
      validation[key] = {
        state: false,
        feedback: "",
      };
    }
  };

  const handlerFormError = (errorFields) => {
    for (const [key, value] of Object.entries(errorFields)) {
      validation[key] = { state: true, feedback: value[0] };
    }
  };

  // prettier-ignore
  const clientValidateForm = (form, rules = [], fieldsToIgnore = []) => {
	const errors = {};
	for (const key in form) {
		if (rules[key] && rules[key].length && !fieldsToIgnore.some(k => k === key)) {
			const _errors = rules[key]
			.map((rule) => rule(form, key))
			.filter((err) => typeof err === "string")
			if (_errors.length) errors[key] = _errors;
		}
	}
	// TODO: refactor
	if(isEmpty(errors)) {
		return false;
	} else {
		return errors;
	}
};

  return {
    validation,
    clientValidateForm,
    initValidation,
    handlerFormError,
  };
};
