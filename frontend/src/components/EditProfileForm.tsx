import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileThunk } from "../slices/userSlice";

import { uploads } from "../utils/config";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
};

const EditProfileForm = ({ isOpen, onClose, user }: Props) => {
  if (!isOpen) return null;
  const dispatch: AppDispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | Blob | null>(null);
  const [bio, setBio] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<File | Blob | null>(null);
  const { error, loading } = useSelector((state: RootState) => state.user);
  const [errorMessage, setErrorMessage] = useState<string>("");

  interface UserData {
    name: string;
    username?: string;
    profileImage?: File | Blob;
    bio?: string;
    password?: string;
    [key: string]: string | File | Blob | undefined;
  }

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: UserData = {
      name,
    };

    if (profileImage) {
      userData.profileImage = profileImage;
    }
    if (bio) {
      userData.bio = bio;
    }
    if (password) {
      userData.password = password;
    }
    if (username) {
      userData.username = username;
    }

    if (userData.name.length < 4 || userData.name.length > 60) {
      setErrorMessage("O minimo de caracteres pro nome é 5 e o máximo é 60.");
      return;
    }

    if (userData?.username!.length < 4 || userData?.username!.length > 18) {
      setErrorMessage(
        "O minimo de caracteres pro @username é 5 e o máximo é 18."
      );
      return;
    }

    if (userData?.username!.startsWith("@")) {
      userData.username?.substring(1);
      return;
    }
    if (userData?.username!.includes(" ")) {
      setErrorMessage("No @username não pode incluir espaços");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userData?.username!)) {
      setErrorMessage(
        "o @username so pode conter letras, números e underscore"
      );
      return;
    }

    if (password) {
      if (password.length < 5) {
        setErrorMessage("A senha precisa ter pelo menos 5 caracteres");
        return;
      }
    }

    const formData = new FormData();

    formData.append("name", userData.name);

    if (userData.profileImage) {
      formData.append("profileImage", userData.profileImage);
    }
    if (userData.bio) {
      formData.append("bio", userData.bio);
    }
    if (userData.password) {
      formData.append("password", userData.password);
    }
    if (userData.username) {
      formData.append("username", userData.username);
    }

    await dispatch(updateProfileThunk(formData));
    console.log(userData);
    console.log("erro:" + error);

    onClose();
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image: File = e.target.files[0];

      if (image.type !== "image/png" && image.type !== "image/jpeg") {
        setErrorMessage("Por favor, envie uma imagem no formato PNG ou JPG.");
        setProfileImage(null);
        setPreviewImage(null);
        return;
      }

      setPreviewImage(image);
      setProfileImage(image);
      setErrorMessage("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white flex flex-col  items-center p-5 rounded-lg w-[600px] mb-[100px]">
        <p className="mb-1 text-xl">Sua foto de perfil:</p>
        {(user.profileImage || previewImage) && (
          <img
            src={
              previewImage
                ? URL.createObjectURL(previewImage)
                : `${uploads}/users/${user.profileImage}`
            }
            alt=""
            className="w-24 h-24 rounded-full"
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label>Imagem do perfil:</label>
          <p className="font-bold">
            Por favor, escolher em formato PNG ou JPEG.
          </p>
          <input type="file" className="mb-5" onChange={handleFile} />
          <p></p>
          <label>Nome completo:</label>
          <input
            type="text"
            className="border-2 w-[400px] h-[40px] rounded-md p-2 mb-4  focus:outline-none"
            placeholder="Digite seu novo nome "
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            maxLength={100}
          />
          <label>Username:</label>
          <input
            type="text"
            className="border-2 w-[400px] h-[40px] rounded-md p-2 mb-4  focus:outline-none"
            placeholder="Digite seu novo @username "
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <label>E-mail:</label>
          <input
            type="email"
            className="border-2 w-[400px] h-[40px] rounded-md p-2 mb-4  focus:outline-none read-only:bg-gray-100"
            placeholder="seu email "
            value={email}
            readOnly
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <label>Bio:</label>
          <textarea
            className="border-2 w-[400px] h-[80px] rounded-md p-2 mb-4 resize-none  focus:outline-none"
            placeholder="Digite sua bio "
            value={bio}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setBio(e.target.value)
            }
          />
          <label>Nova senha:</label>
          <input
            type="password"
            className="border-2 w-[400px] h-[40px] rounded-md p-2 mb-4  focus:outline-none"
            placeholder="Digite sua nova senha"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          {!loading && (
            <button className="bg-green-500 text-white font-extrabold p-2 rounded-md hover:bg-green-600">
              salvar mudanças
            </button>
          )}
          {loading && (
            <button
              disabled
              className="bg-green-500 text-white font-extrabold p-2 rounded-md hover:bg-green-600"
            >
              salvar mudanças
            </button>
          )}
        </form>
        <div className="flex flex-row space-x-32 mt-2">
          <button
            className="text-green-500 font-extrabold p-2 rounded-md hover:bg-slate-100"
            onClick={onClose}
          >
            cancelar
          </button>
        </div>
        {errorMessage && (
          <p className="bg-red-200 text-red-700 p-2 rounded-md">
            {errorMessage}
          </p>
        )}
        {error && (
          <p className="bg-red-200 text-red-700 p-2 rounded-md">{error}</p>
        )}
      </div>
    </div>
  );
};

export default EditProfileForm;
