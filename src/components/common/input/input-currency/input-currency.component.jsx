import { useState, useEffect } from "react";
import AuthService from "../../../../utils/AuthService";
import { postDict } from "../../../../API/dictionaries/dictionary-apis";
import { getDict, delDict } from "../../../../API/dictionaries/dictionary-apis";
import { currencies } from "./static/currencies";
import MultiSelect from "../../select/multiSelect/multiSelect.component";

const InputCurrency = (props) => {
  const [currencyList, setCurrencyList] = useState([]);
  const userInfo = AuthService.getUserInfo();
  const [headers] = useState(AuthService.getHeaders());
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [hasBDManagerRole, setHasBDManagerRole] = useState(false);

  const parseOptions = (dictRecords) => {
    let options = [];
    if (Array.isArray(dictRecords)) options = [...dictRecords];
    else options.push(dictRecords);
    return options
      ? options.map((item) => ({
        id: item.value[item.value.length - 1],
        value: item.value[item.value.length - 1],
        name: item.value.toUpperCase(),
        dbId: item.id,
      }))
      : [];
  };

  useEffect(() => {
    getDict("currency", headers).then((list) =>
      setCurrencyList([...currencies, ...parseOptions(list)])
    );
  }, [props.options, headers]);

  useEffect(() => {
    setHasAdminRole(AuthService.hasAdminRole());
    setHasBDManagerRole(AuthService.hasBDManagerRole());
  }, [userInfo]);

  const multiSelectChange = (options, resource) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.id)
      .join(",");
    const change = { target: { name: props.id, value: selected || "" } };

    // add new if exists
    options
      .filter((o) => !o.id)
      .forEach((o) => {
        const val = o.value.toUpperCase();
        postDict(resource, val, headers).catch((err) => console.log(err));
      });

    // delete marked if exists
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        currencyList
          .filter((c) => c.name === o.value && c.id === o.id)
          .forEach((c) => {
            if (c.dbId)
              delDict(c.dbId, headers).catch((err) => console.log(err));
          });
      });

    props.handleChange(change);
  };

  return (
    <>
      <MultiSelect
        disabled={props.disabled}
        options={currencyList.map((o) => ({
          id: o.value,
          value: o.name,
          selected: props.value === o.id,
          dbId: o.dbId,
        }))}
        handleChange={(e) => multiSelectChange(e, "currency")}
        deletable={hasAdminRole || hasBDManagerRole}
        creatable={hasAdminRole || hasBDManagerRole}
        placeholder={props.placeholder}
        className={props.className}
      />
    </>
  );
};

export default InputCurrency;
