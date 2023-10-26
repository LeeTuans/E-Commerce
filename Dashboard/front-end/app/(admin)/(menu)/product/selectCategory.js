import React from "react";
import { Select, Option } from "@material-tailwind/react";

function SelectCategory({ data, findByCategory }) {
  return (
    <Select label="Category" onChange={(value) => findByCategory(value)}>
      {data.map(({ _id, name }) => (
        <Option key={_id} value={_id}>
          {name}
        </Option>
      ))}
    </Select>
  );
}

export default SelectCategory;
