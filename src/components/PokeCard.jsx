import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LazyImage from "./LazyImage";

const PokeCard = ({ url, name }) => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetchPokemonDetailData();
  }, []);

  async function fetchPokemonDetailData() {
    try {
      const response = await axios.get(url);
      const pokemonData = formatPokemonData(response.data);
      console.log(`Formatted Pokemon Data:`, pokemonData); // 로깅 위치 수정
      setPokemon(pokemonData);
    } catch (error) {
      console.error(error);
    }
  }

  function formatPokemonData(params) {
    const { id, types, name } = params;
    return {
      id,
      name,
      types: types[0].type.name, // 첫 번째 타입만 추출
    };
  }

  const bg = `bg-${pokemon?.types || "none"}`;
  const border = `border-${pokemon?.types || "none"}`;
  const text = `text-${pokemon?.types || "none"}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;

  console.log(text);

  return (
    <>
      {pokemon && (
        <Link
          to={`/pokemon/${name}`}
          className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
        >
          <div
            className={`${text} h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
          >
            #{pokemon.id.toString().padStart(3, "00")}
          </div>
          <div className="w-full f-6 flex items-center justify-center">
            <div
              className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center`}
            >
              <LazyImage url={img} alt={name} />
            </div>
          </div>
          <div
            className={`${bg} text-center text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1`}
          >
            {pokemon.name}
          </div>
        </Link>
      )}
    </>
  );
};

export default PokeCard;
