import React, { useEffect, useState } from "react";
import Type from "./Type";

const DamageRelations = ({ damages }) => {
  const [damagePokemonForm, setDamagePokemonForm] = useState(0);
  console.log(Object.entries(damagePokemonForm));

  useEffect(() => {
    if (!damages || !Array.isArray(damages) || damages.length === 0) {
      console.warn("Damages data is invalid:", damages);
      return;
    }

    const arrayDamage = damages.map((damage) =>
      seperateObjectBetweenToAndFrom(damage)
    );

    if (arrayDamage.length === 2) {
      const obj = joinDamageRelations(arrayDamage);
      if (obj && obj.from) {
        setDamagePokemonForm(reduceDuplicateValue(postDamageValue(obj.from)));
      } else {
        console.warn("Invalid object structure:", obj);
      }
    } else if (arrayDamage[0] && arrayDamage[0].from) {
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    } else {
      console.warn("Invalid arrayDamage structure:", arrayDamage[0]);
    }
  }, [damages]);

  const joinDamageRelations = (props) => ({
    to: joinObject(props, "to"),
    from: joinObject(props, "from"),
  });

  const reduceDuplicateValue = (props) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const verifiedValue = filterForUniqueValues(
        value,
        duplicateValues[keyName]
      );
      return {
        ...acc,
        [keyName]: verifiedValue,
      };
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    if (!Array.isArray(valueForFiltering)) return [];

    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;

      const filterACC = acc.filter((a) => a.name !== name);
      if (filterACC.length === acc.length) {
        acc.push(currentValue);
      } else {
        acc.push({ damageValue: damageValue, name, url });
      }

      return acc;
    }, []);
  };

  const joinObject = (props, key) => {
    const firstArrayValue = props[0][key] || {};
    const secondArrayValue = props[1][key] || {};

    return Object.entries(secondArrayValue).reduce((acc, [keyName, value]) => {
      const combinedValue = firstArrayValue[keyName]
        ? firstArrayValue[keyName].concat(value)
        : value;
      return {
        ...acc,
        [keyName]: combinedValue,
      };
    }, {});
  };

  const postDamageValue = (props) => {
    const damageMapping = {
      double_damage: "2x",
      half_damage: "1/2x",
      no_damage: "0x",
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const damageValue = damageMapping[keyName] || "1x";
      return {
        ...acc,
        [keyName]: value.map((i) => ({
          damageValue,
          ...i,
        })),
      };
    }, {});
  };

  const seperateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);

    return { from, to };
  };

  const filterDamageRelations = (valueFilter, damage) => {
    if (!damage || typeof damage !== "object") return {};

    return Object.entries(damage)
      .filter(([keyName]) => keyName.includes(valueFilter))
      .reduce((acc, [keyName, value]) => {
        const keyWithValueFilterRemoved = keyName.replace(valueFilter, "");
        return {
          ...acc,
          [keyWithValueFilterRemoved]: value,
        };
      }, {});
  };

  return (
    <div className="flex gap-2 flex-col w-full">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]) => {
            const key = keyName;
            const valueOfKeyName = {
              double_damage: "Weak",
              half_damage: "Resistance",
              no_damage: "Immune",
            };

            return (
              <div key={key}>
                <h3 className="capitalize font-bold pb-[10px] text-sm md:text-base text-slate-500 text-center">
                  {valueOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => {
                      return (
                        <Type type={name} key={url} damageValue={damageValue} />
                      );
                    })
                  ) : (
                    <Type type={"none"} key={"none"} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;
