declare namespace Ec {
  type OriginFieldsObj = { [prop: string]: string };

  type OriginTable = {
    name: string;
    do: OriginFieldsObj;
    dtoMap: { [prop: string]: OriginFieldsObj };
    voMap: { [prop: string]: OriginFieldsObj };
  };

  type FieldType =
    | "none"
    | "int"
    | "long"
    | "str"
    | "bool"
    | "date"
    | "date-time"
    | "time-stamp";
}
