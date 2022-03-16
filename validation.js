import { required, minLength, email } from "vuelidate/lib/validators";
import isEmpty from "lodash/isEmpty";
// prettier-ignore
export const registerFormRules = {
	name: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению",
		(form, key) => minLength(3)(form[key]) || "Name must be less than 3 characters"
	],
	email: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению",
		(form, key) => email(form[key])        || "Email is invalid"
	],
	phone: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению"
	],
	password: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению",
		(form, key) => minLength(4)(form[key]) || "Name must be less than 4 characters"
	],
	password_confirmation: [(form, key) => form["password"] === form[key] || "Пароли не совпадают"]
};

// prettier-ignore
export const loginFormRules = {
	email: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению",
		(form, key) => email(form[key])        || "Email is invalid"
	],
	phone: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению"
	],
	password: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению",
		(form, key) => minLength(4)(form[key]) || "Name must be less than 4 characters"
	],
};

// prettier-ignore
export const resetFormRules = {
	email: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению",
		(form, key) => email(form[key])        || "Email is invalid"
	],
	phone: [
		(form, key) => required(form[key])     || "Поле обязательно к заполнению"
	]
};

// prettier-ignore
export const clientValidateForm = (form, rules = [], fieldsToIgnore = []) => {
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
