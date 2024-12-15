import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Type from "../../components/Type";
import { Loading } from "../../assets/Loading";
import { Balance } from "../../assets/Balance";
import { Vector } from "../../assets/Vector";
import BaseStat from "../../components/BaseStat";
import DamageModal from "../../components/DamageModal";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

  useEffect(() => {
    setIsLoading(true);
    fetchPokemonData(pokemonId);
  }, [pokemonId]);

  async function fetchPokemonData(id) {
    const url = `${baseUrl}${id}`;
    try {
      const { data: pokemonData } = await axios.get(url);
      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities, sprites } =
          pokemonData;

        console.log(sprites);
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations;
          })
        );

        const formattedPokemonData = {
          id: id,
          name: name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonstats(stats),
          DamageRelations,
          types: types.map((type) => type.type.name),
          sprites: formatPokemonSprites(sprites),
          description: await getPokemonDescription(id),
        };

        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  // 한글로 된 데이터만 뽑아오는 것
  const filterAndFormatDescription = (flavorText) => {
    const koreanDescriptions = flavorText
      ?.filter((text) => text.language.name === "ko")
      .map((text) => text.flavor_text.replace(/\r|\n|\f/g, " "));
    return koreanDescriptions;
  };

  const getPokemonDescription = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    const { data: pokemonSpecies } = await axios.get(url);

    // species 데이터 안에 들어있는 해당 포켓몬에 설명을 한국어로 배열 안에 다 넣어주기
    const descriptions = filterAndFormatDescription(
      pokemonSpecies.flavor_text_entries
    );

    // 배열 안에 있는 것 중 하나만 랜덤으로 뽑기
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const formatPokemonSprites = (sprites) => {
    // 원본 복사해서 새롭게 만들어줌
    const newSprites = { ...sprites };
    Object.keys(newSprites).forEach((key) => {
      if (typeof newSprites[key] !== "string") {
        delete newSprites[key];
      }
    });

    return Object.values(newSprites);
  };

  const formatPokemonstats = ([
    statHP,
    statATK,
    statDEF,
    statSATK,
    statSDEP,
    statSPD,
  ]) => [
    { name: "Hit Points", baseStat: statHP.base_stat },
    { name: "Attack", baseStat: statATK.base_stat },
    { name: "Defense", baseStat: statDEF.base_stat },
    { name: "Special Attack", baseStat: statSATK.base_stat },
    { name: "Special Defense", baseStat: statSDEP.base_stat },
    { name: "Speed", baseStat: statSPD.base_stat },
  ];

  const formatPokemonAbilities = (abilities) => {
    return abilities
      .filter((abilities, index) => index <= 1)
      .map((obj) => obj.ability.name.replaceAll("-", " "));
  };

  async function getNextAndPreviousPokemon(id) {
    const previousPokemonId = id > 1 ? id - 1 : null; // ID 1보다 작으면 null
    const nextPokemonId = id + 1; // 다음 ID는 항상 +1

    const previousPokemon = previousPokemonId
      ? await axios.get(`${baseUrl}${previousPokemonId}`)
      : null;
    const nextPokemon = await axios.get(`${baseUrl}${nextPokemonId}`);

    return {
      previous: previousPokemon ? previousPokemon.data.name : null,
      next: nextPokemon ? nextPokemon.data.name : null,
    };
  }

  if (isLoading) {
    return (
      <div
        className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}
      >
        <Loading className="w-12 h-12 z-50 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!isLoading && !pokemon) {
    return <div>... NOT FOUND</div>;
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  return (
    <article className="flex items-center gap-1 flex-col w-full">
      <div
        className={`${bg} w-full h-full min-h-screen flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        <Link
          className="absolute top-[50%] -translate-y-1/2 z-50 left-1"
          to={`/pokemon/${pokemon.previous}`}
        >
          <span
            className="material-icons text-white absolute z-[9999]"
            style={{ fontSize: "20px" }}
          >
            arrow_back_ios
          </span>
        </Link>

        <Link
          className="absolute top-[50%] -translate-y-1/2 z-50 right-1"
          to={`/pokemon/${pokemon.next}`}
        >
          <span
            className="absolute right-0 material-icons text-white z-[9999]"
            style={{ fontSize: "20px" }}
          >
            arrow_forward_ios
          </span>
        </Link>

        {/* 포켓몬 이미지 */}

        <section className="w-full h-full flex flex-col items-center justify-center">
          <div className="absolute z-30 top-2 left-0 flex items-center w-full justify-between">
            <div className="flex items-center gap-1">
              <Link to="/" className="flex">
                <span className="text-zinc-200 material-icons z-[9999]">
                  arrow_back
                </span>
              </Link>
              <h3 className="text-zinc-200 font-bold text-xl capitalize">
                {pokemon.name}
              </h3>
            </div>
            <div className="text-zinc-200 font-bold text-md pr-[5px]">
              #{pokemon.id.toString().padStart(3, "00")}
            </div>
          </div>

          <div className="relative max-w-[15.5rem] mt-6 -mb-16 flex items-center justify-center">
            <img
              src={img}
              width="100%"
              height="100%"
              loading="lazy"
              alt={pokemon.name}
              className="object-contain h-full max-w-full cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>

        <section className="w-full bg-gray-800 pt-[65px] flex flex-col items-center gap-3 px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {/* 포켓몬 타입 */}
            {pokemon.types.map((type) => (
              <Type key={type} type={type} />
            ))}
          </div>

          <h2 className={`text-base font-semibold text-${pokemon.types[0]}`}>
            정보
          </h2>

          <div className="flex justify-between max-w-[400px] text-center w-full">
            <div>
              <h4 className="text-[0.8rem] pb-[12px] text-zinc-100">Weight</h4>
              <div className="flex justify-center items-center gap-2 text-sm text-zinc-200 ">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>
            <div>
              <h4 className="text-[0.8rem] pb-[12px] text-zinc-100">Height</h4>
              <div className="flex justify-center items-center gap-2 text-sm text-zinc-200">
                <Vector />
                {pokemon.height}m
              </div>
            </div>
            <div>
              <h4 className="text-[0.8rem] pb-[12px] text-zinc-100">
                Abilities
              </h4>
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability}
                  className="text-[0.5rem] text-zinc-100 capitalize"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2
              className={`pb-[5px] text-base font-semibold text-${pokemon.types[0]}`}
            >
              기본 능력치
            </h2>
            <div className="w-full flex justify-center">
              <table>
                <tbody>
                  {pokemon.stats.map((stat) => (
                    <BaseStat
                      key={stat.name}
                      valueStat={stat.baseStat}
                      nameStat={stat.name}
                      type={pokemon.types[0]}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <h2 className={`pb-[5px] text-base font-semibold ${text}`}>설명</h2>
            <p className="text-sm leading-5 text-zinc-200 text-center max-w-[30rem]">
              {pokemon.description.split(". ").map((sentence, index) => (
                <span key={index}>
                  {sentence.trim()}
                  {index < pokemon.description.split(". ").length - 1 && "."}
                  <br />
                </span>
              ))}
            </p>
          </div>

          <div className="flex my-3 flex-wrap justify-center">
            {pokemon.sprites.map((url, index) => (
              <img key={index} src={url} alt="sprites" />
            ))}
          </div>
        </section>
      </div>
      {isModalOpen && (
        <DamageModal
          setIsModalOpen={setIsModalOpen}
          damages={pokemon.DamageRelations}
        />
      )}
    </article>
  );
};

export default DetailPage;
