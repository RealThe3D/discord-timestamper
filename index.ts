#!/usr/bin/env node

// TODO: Add chalk styling.
// TODO: Add the rest of the timestamp collections.
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { getUnixTime, getDaysInMonth } from "date-fns";

console.log("NOTE: Use your LOCAL timezone.");

const month = await input({
  message: "Enter the month:",
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return "You must provide a number.";
    }

    if (Number(value) < 1 || Number(value) > 12) {
      return "The value must be between 1 and 12";
    }

    return true;
  },
});

const daysInMonth = getDaysInMonth(month);

const day = await input({
  message: "Enter the day:",
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return "You must provide a number.";
    }

    if (Number(value) < 0 || Number(value) > daysInMonth) {
      return `The value must be between 0 and ${daysInMonth}.`;
    }

    return true;
  },
});
const year = await input({ message: "Enter the year:" });
const hour = await input({
  message: `Enter the hour ${chalk.blue("(24 hours):")}`,
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return "You must provide a number.";
    }

    if (Number(value) < 0 || Number(value) > 24) {
      return `The value must be between 0 and 24.`;
    }

    return true;
  },
});
const minute = await input({
  message: "Enter the minute:",
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return "You must provide a number.";
    }

    if (Number(value) < 0 || Number(value) > 60) {
      return `The value must be between 0 and 60.`;
    }

    return true;
  },
});
const second = await input({
  message: "Enter the second:",
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return "You must provide a number.";
    }

    if (Number(value) < 0 || Number(value) > 60) {
      return `The value must be between 0 and 60.`;
    }

    return true;
  },
});

const monthToNumber = Number(month) - 1;
const dayToNumber = Number(day);
const yearToNumber = Number(year);
const hourToNumber = Number(hour);
const minutesToNumber = Number(minute);
const secondToNumber = Number(second);

const completeDate = new Date(
  yearToNumber,
  monthToNumber,
  dayToNumber,
  hourToNumber,
  minutesToNumber,
  secondToNumber
);

type timestampType = "default" | "relative";
const timestampSelection: timestampType = await select({
  message: "Select the timestamp formatting",
  choices: [
    { name: "default", value: "default", description: "Default Timestamp." },
    {
      name: "relative",
      value: "relative",
      description: "Relative to current time timestamp.",
    },
  ],
});

switch (timestampSelection) {
  case "default":
    console.log(`<t:${getUnixTime(completeDate)}>`);
    break;
  case "relative":
    console.log(`<t:${getUnixTime(completeDate)}:R>`);
}
