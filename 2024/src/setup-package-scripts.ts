import * as fs from "fs";
import * as path from "path";

const packageJsonPath = "./package.json";
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const boilerplateCodePath = "src/day-boilerplate/code.ts";
const boilerplateExamplePath = "src/day-boilerplate/example.txt";
const boilerplateInputPath = "src/day-boilerplate/input.txt";

const addScriptsAndCopyBoilerplate = () => {
  for (let i = 1; i <= 31; i++) {
    const day = i.toString().padStart(2, "0");
    const dayScript = `day${day}`;
    const dayExampleScript = `day${day}:example`;

    const dayDir = `src/${day}`;
    const dayCodePath = path.join(dayDir, "code.ts");
    const dayExamplePath = path.join(dayDir, "example.txt");
    const dayInputPath = path.join(dayDir, "input.txt");

    // Ensure the day directory exists
    if (!fs.existsSync(dayDir)) {
      fs.mkdirSync(dayDir, { recursive: true });
    }

    // Copy boilerplate files if they don't exist
    if (!fs.existsSync(dayCodePath)) {
      fs.copyFileSync(boilerplateCodePath, dayCodePath);
    }
    if (!fs.existsSync(dayExamplePath)) {
      fs.copyFileSync(boilerplateExamplePath, dayExamplePath);
    }
    if (!fs.existsSync(dayInputPath)) {
      fs.copyFileSync(boilerplateInputPath, dayInputPath);
    }

    // Add scripts to package.json if they don't exist
    if (!packageJson.scripts[dayScript]) {
      packageJson.scripts[
        dayScript
      ] = `ts-node src/${day}/code.ts src/${day}/input.txt`;
    }
    if (!packageJson.scripts[dayExampleScript]) {
      packageJson.scripts[
        dayExampleScript
      ] = `ts-node src/${day}/code.ts src/${day}/example.txt`;
    }
  }
};

addScriptsAndCopyBoilerplate();

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
