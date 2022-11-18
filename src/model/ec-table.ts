import { EcField, EcVoField } from "./ec-field";

export class EcTable {
  depsWaitingResolved: Map<string, string> = new Map();

  name: string;
  DOFieldsMap: Map<string, EcField> = new Map();
  DTOMap: Map<string, Map<string, EcField>> = new Map();
  VOMap: Map<string, Map<string, EcVoField>> = new Map();

  constructor(originData: Ec.OriginTable) {
    this.name = originData.name;
    this.handleDO(originData.do);
    // TODO: 这里本来应该在依赖处理完后再执行的
    this.handleDTO(originData.dtoMap);
    this.handleVO(originData.voMap);
  }

  handleDO(doObj: Ec.OriginFieldsObj) {
    for (const key in doObj) {
      if (Object.prototype.hasOwnProperty.call(doObj, key)) {
        const value = doObj[key];
        const field = this.analysisAttr(key, value);
        this.DOFieldsMap.set(key, field);
      }
    }
  }

  handleDTO(dtoObjMap: { [prop: string]: Ec.OriginFieldsObj }) {
    for (let dtoName in dtoObjMap) {
      if (Object.prototype.hasOwnProperty.call(dtoObjMap, dtoName)) {
        const dtoObj = dtoObjMap[dtoName];
        const inverted = dtoName.startsWith("!");
        if (inverted) dtoName = dtoName.substring(1);
        const dtoFieldsMap = this.handleDerivativeObj(
          this.DOFieldsMap,
          dtoObj,
          inverted
        );
        this.DTOMap.set(dtoName, dtoFieldsMap);
      }
    }
  }

  handleVO(voObjMap: { [prop: string]: Ec.OriginFieldsObj }) {
    for (let voName in voObjMap) {
      if (Object.prototype.hasOwnProperty.call(voObjMap, voName)) {
        const originObj = voObjMap[voName];
        const inverted = voName.startsWith("!");
        if (inverted) voName = voName.substring(1);

        const fieldsMap = this.handleDerivativeObj(
          this.DOFieldsMap,
          originObj,
          inverted
        );
        const voFieldMap = new Map<string, EcVoField>();
        fieldsMap.forEach((field, fieldName) => {
          const voField = field.toVoField();
          // TODO: 把引用值填充上去
          voFieldMap.set(fieldName, voField);
        });
        this.VOMap.set(voName, voFieldMap);
      }
    }
  }

  /**
   *
   * @param originFieldsMap 全部字段集合
   * @param derivativeObj 需要处理的原始字段对象
   * @param inverted 是否反选
   * @returns 字段映射表
   */
  handleDerivativeObj(
    originFieldsMap: Map<string, EcField>,
    derivativeObj: Ec.OriginFieldsObj,
    inverted: boolean = false
  ) {
    const fieldsMap = new Map<string, EcField>();
    if (!inverted) {
      // 正选
      originFieldsMap.forEach((field, fieldName) => {
        const targetValue = derivativeObj[fieldName];
        if (!targetValue) {
          fieldsMap.set(fieldName, field);
        } else {
          const newField = this.analysisAttr(fieldName, targetValue);
          if (newField.type === "none") return;
          fieldsMap.set(fieldName, newField);
        }
      });
    } else {
    }
    return fieldsMap;
  }

  private analysisAttr(name: string, attrStr: string): EcField {
    const field = new EcField();
    field.name = name;
    if (!attrStr.startsWith("~")) {
      // 普通声明
      const pattern = /^([\w\-]+)(!)?(:[\(\)\-\|\d]+)?(\?[$\w]+)?/;
      const matches = pattern.exec(attrStr);
      if (matches) {
        const fieldType = matches[1] || "none";
        const canBeBlank = !matches[2];
        const range = matches[3]?.substring(1) || null;
        const defaultValue = matches[4]?.substring(1) || null;

        field.type = fieldType as Ec.FieldType;
        field.canBeBlank = canBeBlank;
        field.range = range;
        field.defaultValue = defaultValue;
      }
    } else {
      // 引用类型
      const pattern = /^~([\w\.]+)/;
      const matches = pattern.exec(attrStr);
      if (matches) {
        const ref = matches[1];

        // 收集依赖
        this.depsWaitingResolved.set(name, ref);
      }
    }
    return field;
  }
}
