import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploads } from "../utils/config";
import { addPost } from "../slices/postSlice";
import { AppDispatch, RootState } from "../store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const PostForm = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;
  const dispatch: AppDispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.auth);

  const [text, setText] = useState<string>("");

  const handleAddPost = async () => {
    if (text.length === 0 || text === "") {
      setError("O texto não pode ficar vazio");
      return;
    }
    const post = {
      text,
    };

    dispatch(addPost(post));
    console.log("foi adicionado o post!!");
    console.log(error);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-full max-w-[600px] mx-4">
        <div className="rounded-lg p-3 flex items-start bg-white mb-4">
          <img
            src={
              user.profilePicture
                ? `${uploads}/users/${user.profilePicture}`
                : "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
            }
            alt="foto de perfil"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-3 w-full">
            <textarea
              placeholder="O que está acontecendo?"
              className="p-2 w-full focus:outline-none h-[120px] rounded-lg resize-none"
              maxLength={200}
              value={text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setText(e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-white px-4 py-2 mr-auto rounded-md text-green-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-green-500 font-bold text-white px-4 py-2 rounded-md"
            onClick={handleAddPost}
          >
            Postar
          </button>
        </div>
        <div className="flex justify-center">
          {error && (
            <p className="bg-red-300 text-red-700 mt-1 h-[40px] p-2 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;
