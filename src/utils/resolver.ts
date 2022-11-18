import { EcTable } from "../model/ec-table";

export class Resolver {
  constructor() {}

  handle(originDataArr: Ec.OriginTable[]) {
    const tablesMap = this.handleTables(originDataArr);
    this.handleDependencies(tablesMap);
    return tablesMap;
  }

  private handleTables(originDataArr: Ec.OriginTable[]) {
    const tablesMap: Map<string, EcTable> = new Map();
    for (let originData of originDataArr) {
      const ecTable = new EcTable(originData);
      tablesMap.set(originData.name, ecTable);
    }
    return tablesMap;
  }

  private handleDependencies(tablesMap: Map<string, EcTable>) {
    tablesMap.forEach((ecTable, tableName) => {
      const deps = ecTable.depsWaitingResolved;
      deps.forEach((targetStr, key) => {
        const [targetTable, targetKey] = targetStr.split(".");
        const targetFieldMap = tablesMap.get(targetTable)?.DOFieldsMap;
        if (!targetFieldMap) return;
        const targetField = targetFieldMap.get(targetKey);
        if (targetField) {
          ecTable.DOFieldsMap.set(key, targetField);
        }
      });
    });
  }
}
