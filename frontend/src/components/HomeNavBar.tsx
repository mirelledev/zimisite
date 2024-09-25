import { NavLink } from "react-router-dom";

const HomeNavBar = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-center pb-5 font-extrabold text-green-500 text-2xl">
        zimi
      </h1>
      <div>
        <nav className="">
          <ul className="flex flex-row items-center justify-center">
            <li className="pr-2 mb-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "bg-white p-2 mb-2 rounded-md text-green-600 font-extrabold"
                    : "bg-white p-2 mb-2 rounded-md text-green-600"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="pl-2 mb-3">
              <NavLink
                to="/following"
                className={({ isActive }) =>
                  isActive
                    ? "bg-white p-2 mb-2 rounded-md text-green-600 font-bold"
                    : "bg-white p-2 mb-2 rounded-md text-green-600"
                }
              >
                Following
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HomeNavBar;
