import { IPost } from "../interfaces";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { uploads } from "../utils/config";
import { AppDispatch } from "../store";
import { deletePost } from "../slices/postSlice";

type Props = {
  userId?: string;
  post: IPost;
  type: "comment" | "post" | "postpage";
  profilePicture?: string;
};

const Post = ({ post, type, userId, profilePicture }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [dropDown, setDropDown] = useState<boolean>();
  const dropDownRef = useRef<HTMLDivElement | null>(null); // Crie um ref

  const handlePostClick = () => {
    navigate(`/posts/${post._id}`);
  };

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropDown((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(e.target as Node)
    ) {
      setDropDown(false); // Fecha o dropdown se o clique for fora
    }
  };

  const handleDeletePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deletePost(post._id));
    console.log("deletando");
  };

  const handleGoToPerfil = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${post.userId}`);
    console.log("deletando");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Adiciona o listener

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Remove o listener
    };
  }, []);

  const getFormattedDate = (dateString: string) => {
    const dataCriacao = new Date(dateString);
    if (!isNaN(dataCriacao.getTime())) {
      return formatDistanceToNow(dataCriacao, {
        addSuffix: true,
        locale: ptBR,
      });
    } else {
      console.error("Data inválida:", dateString);
      return "Data inválida";
    }
  };

  return (
    <div
      className="rounded-lg p-3 flex items-start bg-white cursor-pointer xl:w-full lg:w-[600px] md:w-[500px] sm:w-[450px] w-[340px] "
      onClick={handlePostClick}
    >
      <img
        src={
          profilePicture
            ? `${uploads}/users/${profilePicture}`
            : "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
        }
        alt="foto de perfil"
        className="w-12 h-12 rounded-full"
        onClick={(e) => handleGoToPerfil(e)}
      />

      <div className="flex flex-col flex-1 p-2">
        <div className="flex items-center">
          <span
            className={
              type === "postpage"
                ? "font-extrabold hover:underline cursor-pointer text-xl break-words overflow-hidden  max-w-[200px] xl:max-w-[700px]"
                : "font-extrabold hover:underline cursor-pointer break-words overflow-hidden  max-w-[200px] xl:max-w-[650px]"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <Link to={`/users/${post.userId}`}>{post.userRealName}</Link>
          </span>

          <p className="text-sm lg:block xl:block md:block sm:block text-slate-400 ml-2 ">
            {post.createdAt
              ? getFormattedDate(post.createdAt)
              : "Data não disponível"}
          </p>

          {userId === post.userId && (
            <div ref={dropDownRef} className="flex flex-col ml-auto">
              {dropDown ? (
                <div className="ml-auto shadow-md rounded-md text-red-700 w-[100px] text-center flex flex-col">
                  <button
                    className="font-bold bg-white rounded-md"
                    onClick={(e) => handleDeletePost(e)}
                  >
                    apagar
                  </button>
                </div>
              ) : (
                <button
                  className="ml-auto font-bold relative xl:right-[40px] lg:right-[90px] md:right-[100px] sm:right-[40px]"
                  onClick={handleOpenMenu}
                >
                  ...
                </button>
              )}
            </div>
          )}
        </div>

        <span
          className={
            type === "postpage"
              ? "text-slate-800 cursor-pointer text-lg"
              : "text-slate-800 cursor-pointer"
          }
          onClick={(e) => e.stopPropagation()}
        >
          <Link to={`/users/${post.userId}`}>@{post.username}</Link>
        </span>

        <div className="flex flex-col xl:w-[700px]  lg:w-[600px] md:w-[500px] sm:w-[400px] w-[250px]  ">
          <p
            className={
              type === "postpage"
                ? "mt-2 text-left cursor-pointer text-xl break-words overflow-hidden lg:w-[500px] xl:w-[650px] md:w-[400px] sm:w-[350px] w-[200px]"
                : "mt-2 text-left cursor-pointer break-words overflow-hidden lg:w-[500px] xl:w-[650px] md:w-[400px] sm:w-[350px] w-[200px] "
            }
            onClick={handlePostClick}
          >
            {post.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
