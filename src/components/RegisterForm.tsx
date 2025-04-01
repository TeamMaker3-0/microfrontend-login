import React, { useState, FormEvent, Fragment } from "react";
import axios from "axios";

import ButtonGroup from "@atlaskit/button/button-group";
import Button from "@atlaskit/button/standard-button";
import { Checkbox } from "@atlaskit/checkbox";
import Form, {
  CheckboxField,
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  RequiredAsterisk,
  ValidMessage,
} from "@atlaskit/form";
import Select, { type ValueType as Value } from "@atlaskit/select";
import TextField from "@atlaskit/textfield";
// Importamos el componente RegisterForm
import LoginForm from "./LoginForm";

interface Option {
  label: string;
  value: string;
}
interface Category {
  roles?: Value<Option>;
}

const roles = [
  { label: "Profesor", value: "profesor" },
  { label: "Alumno", value: "estudiante" },
];

const RegisterForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [run, setRun] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("estudiante");
  const [eneatype, setEneatype] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [eneatipoDefecto] = useState<string>("0");

  const handleRegister = async (data: {
    name: string;
    run: string;
    email: string;
    password: string;
    role: Value<Option>;
  }) => {
    try {
      const response = await axios.post(
        "http://4.228.227.51:3000/api/users/register",
        {
          name: data.name,
          run: data.run,
          email: data.email,
          role: data.role?.value,
          eneatype: eneatipoDefecto,
          password: data.password,
        },
        { withCredentials: true }
      );
      setMessage("¡Registro exitoso!");
      window.confirm("Registro Correcto");
      console.log("Registro exitoso:", response.data);
      setShowLogin(true);
      // Aquí podrías redirigir al usuario o limpiar el formulario
    } catch (error: any) {
      console.log("data", data);
      console.error(
        "Error al registrarse:",
        error.response?.data || error.message
      );
      setMessage("Error al registrarse");
      window.confirm("Error al registrarse");
    }
  };

  // Si se activa el estado showRegister, mostramos el componente RegisterForm
  if (showLogin) {
    return <LoginForm />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "400px",
          maxWidth: "100%",
          margin: "0 auto",
          flexDirection: "column",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "10 10 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form<{
          name: string;
          run: string;
          email: string;
          password: string;
          role: Value<Option>;
        }>
          onSubmit={(data) => handleRegister(data)}
        >
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <FormHeader title="Registro de usuario de TeamMaker">
              <div style={{ color: "red", textAlign: "center" }}>
                  Versión Beta
                </div>
                <p aria-hidden="true">
                  Los campos obligatorios están marcados con un asterisco{" "}
                  <RequiredAsterisk />
                </p>
              </FormHeader>
              <FormSection>
                <Field
                  aria-required={true}
                  name="name"
                  label="Name"
                  isRequired
                  defaultValue="Nombre Apellido"
                >
                  {({ fieldProps, error }) => (
                    <Fragment>
                      <TextField autoComplete="off" {...fieldProps} />
                      {!error && (
                        <HelperMessage>
                          Ingrese su Nombre y Apellido
                        </HelperMessage>
                      )}
                    </Fragment>
                  )}
                </Field>
                <Field
                  aria-required={true}
                  name="run"
                  label="Run"
                  defaultValue=""
                  isRequired
                  validate={(value) => {
                    const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
                    if (!value) {
                      return "Este campo es obligatorio";
                    } else if (!rutRegex.test(value)) {
                      return "Rut incorrecto, intente nuevamente en formato sin puntos y con guión";
                    }
                    return undefined;
                  }}
                >
                  {({ fieldProps, error, valid, meta }) => {
                    return (
                      <Fragment>
                        <TextField {...fieldProps} />
                        {!error && (
                          <HelperMessage>
                            Ingrese su rut sin puntos y con guión
                          </HelperMessage>
                        )}
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        {valid && meta.dirty ? (
                          <ValidMessage>Rut válido</ValidMessage>
                        ) : null}
                      </Fragment>
                    );
                  }}
                </Field>
                <Field
                  aria-required={true}
                  name="email"
                  label="Email"
                  isRequired
                  defaultValue="correo@example.com"
                >
                  {({ fieldProps, error }) => (
                    <Fragment>
                      <TextField autoComplete="off" {...fieldProps} />
                      {!error && (
                        <HelperMessage>
                          Ingrese su correo electronico
                        </HelperMessage>
                      )}
                      {error && (
                        <ErrorMessage>Este correo ya está en uso</ErrorMessage>
                      )}
                    </Fragment>
                  )}
                </Field>
                <Field
                  aria-required={true}
                  name="password"
                  label="Contraseña"
                  defaultValue=""
                  isRequired
                  validate={(value) =>
                    value && value.length < 4 ? "TOO_SHORT" : undefined
                  }
                >
                  {({ fieldProps, error, valid, meta }) => {
                    return (
                      <Fragment>
                        <TextField type="password" {...fieldProps} />
                        {!error && (
                          <HelperMessage>Ingrese su contraseña</HelperMessage>
                        )}
                        {error && (
                          <ErrorMessage>
                            Contraseña mayor a 4 caracteres
                          </ErrorMessage>
                        )}
                        {valid && meta.dirty ? (
                          <ValidMessage>Contraseña valida!</ValidMessage>
                        ) : null}
                      </Fragment>
                    );
                  }}
                </Field>
                <Field<Value<Option>>
                  name="role"
                  label="Selecciona tu rol"
                  defaultValue={null}
                  isRequired
                  validate={(value) => {
                    if (!value) {
                      return "Este campo es obligatorio";
                    }
                    return undefined;
                  }}
                >
                  {({ fieldProps: { id, ...rest }, error }) => (
                    <Fragment>
                      <Select<Option>
                        inputId={id}
                        {...rest}
                        options={roles}
                        isClearable
                        clearControlLabel="Clear role"
                      />
                      {error && <ErrorMessage>{error}</ErrorMessage>}
                    </Fragment>
                  )}
                </Field>
              </FormSection>

              <FormFooter>
                <ButtonGroup label="Form submit options">
                  <Button
                    appearance="subtle"
                    onClick={() => setShowLogin(true)}
                  >
                    ¿Ya tiene cuenta?
                  </Button>
                  <Button
                    type="submit"
                    appearance="primary"
                  >
                    Registrar usuario
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
