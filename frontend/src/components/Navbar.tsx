import { NavLink } from "react-router-dom";
import { CiHome, CiUser, CiSearch } from "react-icons/ci";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useEffect, useState } from "react";
import PostForm from "./PostForm";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { uploads } from "../utils/config";

type Props = {
  userState: any;
};

const Navbar = ({}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newProfilePicture, setNewProfilePicture] = useState<
    string | undefined
  >("");

  const [username, setUsername] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const { user: userAuth } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.user);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (user._id === userAuth.id) {
      setName(user.name);
      setUsername(user.username);
      setNewProfilePicture(user.profileImage);
    }
  }, [user.profileImage, userAuth, user.name, user.username]);

  return (
    <>
      {isModalOpen && <PostForm isOpen={isModalOpen} onClose={closeModal} />}
      <nav
        className="flex lg:flex-col  bg-white p-4 rounded-xl shadow-lg items-center
                    fixed bottom-5 left-1/2 transform -translate-x-1/2  w-[400px] lg:w-[250px] lg:h-[450px] lg:mt-20 lg:items-center lg:static lg:transform-none lg:justify-start"
      >
        {/* Profile section, only visible on larger screens */}
        <div className="hidden lg:flex flex-col items-center mb-4">
          <img
            src={
              userAuth?.profilePicture || newProfilePicture
                ? `${uploads}/users/${
                    newProfilePicture || userAuth.profilePicture
                  }`
                : "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
            }
            alt="foto de perfil"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-col items-center justify-center flex  xl:w-[200px] truncate text-center">
            <p className="font-bold w-full lg:w-[200px] truncate">
              {name || userAuth.name}
            </p>
            <p className="truncate w-full lg:w-[200px]">
              @{username || userAuth.username}
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <ul className="flex justify-around w-full lg:flex-col lg:text-center items-center">
          <li className="mb-5 lg:mb-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center p-3 space-x-3 rounded-xl hover:bg-slate-300 font-bold text-green-600"
                  : "flex items-center justify-center p-3 space-x-3 rounded-xl hover:bg-slate-300"
              }
            >
              <CiHome className="text-2xl mb-[-10px] xl:mb-[0px]" />
              <p className="hidden lg:block text-2xl">Início</p>
            </NavLink>
          </li>
          <li className="mb-5 lg:mb-2">
            <NavLink
              to={`/users/${userAuth.id}`}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center p-3 space-x-3 rounded-xl hover:bg-slate-300 font-bold text-green-600"
                  : "flex items-center justify-center p-3 space-x-3 rounded-xl hover:bg-slate-300"
              }
            >
              <CiUser className="text-2xl mb-[-10px] xl:mb-[0px]" />
              <p className="hidden lg:block text-2xl">Perfil</p>
            </NavLink>
          </li>
          <li className="mb-5 lg:mb-0">
            <NavLink
              to="/pesquisar"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center p-3 space-x-3 rounded-xl hover:bg-slate-300 font-bold text-green-600"
                  : "flex items-center justify-center p-3 space-x-3 rounded-xl hover:bg-slate-300"
              }
            >
              <CiSearch className="text-2xl mb-[-10px] xl:mb-[0px]" />
              <p className="hidden lg:block text-2xl ">Pesquisar</p>
            </NavLink>
          </li>

          <button
            className="flex items-center justify-center mb-4 p-3 space-x-3 xl:mt-10 rounded-xl bg-green-500 hover:bg-green-700 cursor-pointer"
            onClick={openModal}
          >
            <HiOutlinePencilAlt className="text-2xl text-white" />
            <p className="hidden lg:block text-white font-bold text-2xl">
              Novo post
            </p>
          </button>
        </ul>

        {/* Post Form modal */}
      </nav>
    </>
  );
};

export default Navbar;
