import { useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { login } from "../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };

    dispatch(login(user));
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen items-center justify-center">
      <h1 className="font-valeraround font-extrabold text-green-400 text-8xl mb-2">
        zimi
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg mb-[150px] w-[300px] xl:w-[600px] lg:w-[500px] md:w-[500px] sm:w-[400px]">
        <h2 className="text-center xl:text-[23px] text-[18px] lg:text-[20px] md:text-[20px] sm:text-[20px]">
          Entre na sua <span className="font-bold text-green-500">conta</span>
        </h2>
        <p className="text-center  text-gray-400">
          Após o login, você será capaz de utilizar o site
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
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

          <p>
            Não possui uma conta?{" "}
            <Link to="/register">
              <span className="font-bold">Cadastrar</span>
            </Link>
          </p>
          {!loading ? (
            <button className="bg-green-600 rounded-xl text-white w-[200px] xl:w-[300px] lg:w-[300px] md:w-[300px], sm:w-[300px] h-[50px] mt-3 text-xl hover:bg-green-700">
              Entrar
            </button>
          ) : (
            <button
              disabled
              className="bg-green-600 rounded-xl text-white w-[200px] xl:w-[300px] lg:w-[300px] md:w-[300px], sm:w-[300px] h-[50px] mt-3 text-xl hover:bg-green-700"
            >
              Aguarde..
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
  );
};

export default Login;
