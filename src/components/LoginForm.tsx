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
import TextField from "@atlaskit/textfield";
// Importamos el componente RegisterForm
import RegisterForm from "./RegisterForm";

import { jwtDecode } from "jwt-decode";
// Ajusta la interfaz a tu estructura
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  run: string;
  eneatype: string;
}

/**
 * Decodifica el token almacenado en localStorage y
 * guarda la información del usuario en localStorage con la clave "userData".
 */
export function decodeAndStoreUserData(): JwtPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Decodificamos el JWT
    const decoded = jwtDecode<JwtPayload>(token);
    // Guardamos la info del usuario como string
    localStorage.setItem("userData", JSON.stringify(decoded));
    return decoded;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showRegister, setShowRegister] = useState<boolean>(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        "http://4.228.227.51:3000/api/users/login",
        { email: data.email, password: data.password },
        { withCredentials: true } // Esto es crucial para que se manejen las cookies
      );
      setMessage("¡Inicio de sesión exitoso!");
      console.log("Login success:", response.data);
      window.confirm("¡Inicio de sesión exitoso!");
      // Aquí podrías guardar el token o redirigir al usuario
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      console.log("token de acceso", token);
      decodeAndStoreUserData();
      window.location.href = "/home";
    } catch (error: any) {
      console.error(
        "Error al iniciar sesión:",
        error.response?.data || error.message
      );
      setMessage("Error: Credenciales inválidas");
      window.confirm("Error: Credenciales inválidas");
    }
  };

  // Handler para recuperar la contraseña
  const handleRecoverPassword = async () => {
    // Se muestra una ventana emergente que solicita el correo del usuario
    const inputEmail = window.prompt("Ingrese su correo para recuperar la contraseña:");
    if (!inputEmail) {
      // Si el usuario cancela o no ingresa nada, se aborta la operación
      window.alert("No se ingresó ningún correo.");
      return;
    }
    try {
      const response = await axios.post(
        "http://4.228.227.51:3000/api/users/recover-password",
        { email: inputEmail },
        { withCredentials: true }
      );
      window.alert(response.data.message);
      window.alert("La nueva contraseña ha sido enviada a su correo electrónico.");
    } catch (error: any) {
      console.error("Error al recuperar contraseña:", error.response?.data || error.message);
      window.alert("Error al recuperar contraseña, email no encontrado.");
    }
  };

  // Si se activa el estado showRegister, mostramos el componente RegisterForm
  if (showRegister) {
    return <RegisterForm />;
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
        <Form<{ email: string; password: string }>
          onSubmit={(data) => handleLogin(data)}
        >
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <FormHeader title="Inicio de Sesión de TeamMaker">
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <Button appearance="subtle" onClick={handleRecoverPassword}>
                    ¿Olvidó su contraseña?
                  </Button>
                </div>
              </FormSection>

              <FormFooter>
                <ButtonGroup label="Form submit options">
                  <Button
                    appearance="subtle"
                    onClick={() => setShowRegister(true)}
                  >
                    ¿No tiene cuenta?
                  </Button>
                  <Button
                    type="submit"
                    appearance="primary"
                  >
                    Iniciar sesión
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

export default LoginForm;
