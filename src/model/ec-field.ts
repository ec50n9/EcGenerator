export class EcField {
  name: string = "";
  type: Ec.FieldType = "none";
  defaultValue: any = null;
  canBeBlank: boolean = true;
  range: string | null = null;

  toVoField() {
    const voField = new EcVoField();
    voField.name = this.name;
    voField.type = this.type;
    voField.defaultValue = this.defaultValue;
    return voField;
  }
}

export class EcVoField {
  name: string = "";
  type: Ec.FieldType = "none";
  defaultValue: any = null;
  ref: string | null = null;
}
