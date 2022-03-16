<template>
  <div class="modal-body p-0 px-3 px-md-0">
    <b-button
      variant="link"
      class="d-block mx-auto ml-md-auto mr-md-0 mb-1"
      @click="toggleControl"
    >
      {{ toggleControlTitle }}
    </b-button>

    <zb-input
      v-if="loginByEmail"
      v-model.trim="form.email"
      label="Email"
      :isError="validation.email.state"
      :errorFeedback="validation.email.feedback"
    />

    <zb-input-phone
      v-else
      v-model.trim="form.phone"
      label="Номер телефона"
      :isError="validation.phone.state"
      :errorFeedback="validation.phone.feedback"
    />

    <zb-input-password
      v-model.trim="form.password"
      label="Пароль"
      :isError="validation.password.state"
      :errorFeedback="validation.password.feedback"
    />

    <div class="modal-action mt-3 mb-5">
      <b-row no-gutters class="justify-content-between">
        <b-col cols="6">
          <b-button
            @click="loginHandler"
            :disabled="isLoading"
            block
            variant="primary"
          >
            <b-spinner v-if="isLoading" small class="mr-2"></b-spinner>
            <span>Войти</span>
          </b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "@nuxt/composition-api";
import ZBInput from "@components/ui/FormControls/ZBInput.vue";
import ZBInputPassword from "@components/ui/FormControls/ZBInputPassword.vue";
import ZBInputPhone from "@components/ui/FormControls/ZBInputPhone.vue";
import { clientValidateForm, loginFormRules } from "./validation";
import { useValidation } from "@composition/useValidation.ts";
import { useAuth } from "@composition/useAuth.ts";
import cloneDeep from "lodash/cloneDeep";

export default defineComponent({
  components: {
    "zb-input": ZBInput,
    "zb-input-password": ZBInputPassword,
    "zb-input-phone": ZBInputPhone,
  },
  setup(props, { emit }) {
    const isLoading = ref(false);

    const LOGIN_BY = {
      EMAIL: "email",
      PHONE: "phone",
    };

    // prettier-ignore
    class LoginForm {
			constructor(data = {}) {
				this.email    = data.email    || "";
				this.phone    = data.phone    || "";
				this.password = data.password || "";
			}
		}
    // prettier-ignore
    const { 
        initValidation, 
        validation, 
        handlerFormError 
    } = useValidation(LoginForm);

    const { login, getUser } = useAuth();
    const form = ref({ ...new LoginForm() });

    initValidation();

    const loginHandler = async () => {
      initValidation();

      const ignoreFeild = loginByEmail.value ? LOGIN_BY.PHONE : LOGIN_BY.EMAIL;

      const errors = clientValidateForm(form.value, loginFormRules, [
        ignoreFeild,
      ]);

      if (errors) {
        handlerFormError(errors);
        return;
      }

      isLoading.value = true;

      try {
        const _form = cloneDeep(form.value);
        delete _form[ignoreFeild];
        await login(_form);
        await getUser();
      } catch (e) {
        console.error("[Login USER ERROR]", { e });
        if (e.response.data.errors) {
          handlerFormError(e.response.data.errors);
        }
      } finally {
        isLoading.value = false;
      }
    };

    const toggleControl = () => {
      initValidation();
      loginByEmail.value = !loginByEmail.value;
    };

    const loginByEmail = ref(false);

    const toggleControlTitle = computed(() => {
      return loginByEmail.value ? "Войти по номеру телефона" : "Войти по email";
    });

    return {
      isLoading,
      loginHandler,
      toggleControl,
      form,
      validation,
      toggleControlTitle,
      loginByEmail,
    };
  },
});
</script>
