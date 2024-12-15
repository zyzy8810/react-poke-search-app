import { useState, useEffect } from "react";
import axios from "axios";
import PokeCard from "./components/PokeCard";
import { useDebounce } from "./hooks/useDebounce";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  // 디바운스된 검색어
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 초기 데이터 로드
  useEffect(() => {
    fetchPokemonData(true);
  }, []);

  // 디바운스된 검색어가 변경될 때 API 호출
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearchInput(debouncedSearchTerm);
    } else {
      fetchPokemonData(true); // 검색어가 비었을 때 초기 데이터 로드
    }
  }, [debouncedSearchTerm]);

  const fetchPokemonData = async (isFirstFetch) => {
    try {
      const offsetValue = isFirstFetch ? 0 : offset + limit;
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url);
      setPokemons(
        isFirstFetch
          ? response.data.results
          : [...pokemons, ...response.data.results]
      );
      setOffset(offsetValue);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  };

  const handleSearchInput = async (searchTerm) => {
    if (searchTerm.length > 0) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
        );
        const pokemonData = {
          url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: response.data.name,
        };
        setPokemons([pokemonData]);
      } catch (error) {
        console.error("Pokemon not found:", error);
        setPokemons([]);
      }
    } else {
      fetchPokemonData(true); // 검색어가 비었을 때 초반 데이터 로드
    }
  };

  return (
    <div className="pt-6 wrapper">
      <header className="header flex flex-col gap-2 w-full px-4 z-50">
        <div className="relative z-50">
          <form
            onSubmit={(e) => e.preventDefault()} // 폼 기본 동작 방지
            className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
              className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center"
            />
            <button
              type="submit"
              className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
            >
              검색
            </button>
          </form>
        </div>
      </header>
      <section className="sc_card pt-6 flex-col justify-content items-center overflow-auto">
        <div className="flex flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {pokemons.length > 0 ? (
            pokemons.map(({ url, name }, index) => (
              <PokeCard key={url} url={url} name={name} />
            ))
          ) : (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다
            </h2>
          )}
        </div>
      </section>
      <button
        onClick={() => fetchPokemonData(false)}
        className="btn_more bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
      >
        더 보기
      </button>
      <footer className="footer"></footer>
    </div>
  );
}

export default App;
