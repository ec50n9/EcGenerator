import * as fs from "fs";
import { Resolver } from "./utils/resolver";

const originJson: Ec.OriginTable[] = JSON.parse(
  fs.readFileSync("src/assets/demo.json", "utf-8")
);
const resolver = new Resolver();
const result = resolver.handle(originJson);
console.log(result.get("User")?.VOMap);
