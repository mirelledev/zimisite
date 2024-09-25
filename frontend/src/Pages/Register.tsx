import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { register } from "../slices/authSlice";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      name,
      username,
      email,
      password,
      confirmPassword,
    };
    dispatch(register(user));
  };

  return (
    <>
      <div className="flex flex-col bg-gray-100 min-h-screen items-center justify-center">
        <h1 className="font-valeraround font-extrabold text-green-400 text-8xl mb-2">
          zimi
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg mb-[150px] w-[300px] xl:w-[600px] lg:w-[500px] md:w-[500px] sm:w-[400px]">
          <h2 className="text-center xl:text-[23px] text-[18px] lg:text-[20px] md:text-[20px] sm:text-[20px]">
            Realize seu{" "}
            <span className="font-bold text-green-500">cadastro</span>
          </h2>
          <p className="text-center  text-gray-400">
            Após o cadastro, você será capaz de utilizar o site
          </p>
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome completo"
              className="border-2 m-2 w-full p-2 rounded-lg focus:outline-none"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Digite seu @username"
              className="border-2 m-2 w-full p-2 rounded-lg focus:outline-none"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
            <input
              type="email"
              placeholder="E-mail"
              className="border-2 m-2 w-full p-2 rounded-lg focus:outline-none"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <input
              type="password"
              placeholder="Senha"
              className="border-2 m-2 w-full p-2 rounded-lg focus:outline-none"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <input
              type="password"
              placeholder="Confirme sua senha"
              className="border-2 m-2 w-full p-2 rounded-lg focus:outline-none"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
            <p>
              Já possui uma conta?{" "}
              <Link to="/login">
                <span className="font-extrabold">Entrar</span>
              </Link>
            </p>
            {!loading ? (
              <button className="bg-green-600 rounded-xl text-white w-[200px] xl:w-[300px] lg:w-[300px] md:w-[300px], sm:w-[300px] h-[50px] mt-3 text-xl hover:bg-green-700">
                Cadastrar
              </button>
            ) : (
              <button
                disabled
                className="bg-green-600 rounded-xl text-white w-[200px] xl:w-[300px] lg:w-[300px] md:w-[300px], sm:w-[300px] h-[50px] mt-3 text-xl hover:bg-green-700"
              >
                Aguarde...
              </button>
            )}
            {error && (
              <p className="mt-5 bg-red-200 text-red-700 p-2 rounded-lg">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
