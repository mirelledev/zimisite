import { ChangeEvent, FormEvent, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const SearchComponent = () => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-10 flex-rol">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="xl:w-[500px] lg:w-[350px] lg:ml-[30px] border-2 h-[40px] md:w-[400px] sm:w-[400px] xl:ml-[0px] rounded-md focus:outline-none p-2 sm:ml-[-200px] ml-[-200px]"
            placeholder="Pesquise por postagens ou usuários"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />
          <button className="border-2 p-2 bg-green-500 text-white font-bold rounded-md md:mr-[140px] xl:mr-[0px] sm:ml-[30px] ">
            pesquisar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchComponent;
