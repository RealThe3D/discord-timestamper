#!/usr/bin/env node

import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { getUnixTime, getDaysInMonth } from "date-fns";

declare const process: {
  stdout: {
    write: (message: string) => void;
  };
};

const theme = {
  accent: chalk.cyan,
  hint: chalk.dim,
  error: chalk.red,
  success: chalk.greenBright,
};

const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const startSpinner = (message: string) => {
  let frame = 0;
  const render = () => {
    process.stdout.write(`\r${theme.accent(spinnerFrames[frame])} ${message}`);
    frame = (frame + 1) % spinnerFrames.length;
  };

  render();
  const interval = setInterval(render, 80);

  return () => {
    clearInterval(interval);
    process.stdout.write(`\r${" ".repeat(message.length + 3)}\r`);
  };
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

console.log(
  `${chalk.bgYellow.black(" NOTE ")} ${theme.hint("Use your local timezone.")}`,
);

const month = await input({
  message: theme.accent("Enter the month (1-12):"),
  transformer: (value) => {
    const monthNumber = Number(value);

    if (monthNumber >= 1 && monthNumber <= 12) {
      return `${value} ${theme.hint(`(${monthNames[monthNumber - 1]})`)}`;
    }

    return value;
  },
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return theme.error("You must provide a number.");
    }

    if (Number(value) < 1 || Number(value) > 12) {
      return theme.error("The value must be between 1 and 12.");
    }

    return true;
  },
});

const daysInMonth = getDaysInMonth(month);

const day = await input({
  message: theme.accent("Enter the day:"),
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return theme.error("You must provide a number.");
    }

    if (Number(value) < 0 || Number(value) > daysInMonth) {
      return theme.error(`The value must be between 0 and ${daysInMonth}.`);
    }

    return true;
  },
});

const year = await input({ message: theme.accent("Enter the year:") });

const hour = await input({
  message: `${theme.accent("Enter the hour")} ${theme.hint("(24 hours):")}`,
  transformer: (value) => {
    const hourNumber = Number(value);

    if (hourNumber >= 0 && hourNumber <= 23) {
      const hour12 = hourNumber % 12 || 12;
      const period = hourNumber >= 12 ? "PM" : "AM";
      return `${value} ${theme.hint(
        `(${String(hour12).padStart(2, "0")}:XX ${period})`,
      )}`;
    }

    return value;
  },
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return theme.error("You must provide a number.");
    }

    if (Number(value) < 0 || Number(value) > 23) {
      return theme.error("The value must be between 0 and 23.");
    }

    return true;
  },
});

const minute = await input({
  message: theme.accent("Enter the minute:"),
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return theme.error("You must provide a number.");
    }

    if (Number(value) < 0 || Number(value) > 60) {
      return theme.error("The value must be between 0 and 60.");
    }

    return true;
  },
});

const second = await input({
  message: theme.accent("Enter the second:"),
  validate: (value) => {
    if (isNaN(Number(value)) || value == "") {
      return theme.error("You must provide a number.");
    }

    if (Number(value) < 0 || Number(value) > 60) {
      return theme.error("The value must be between 0 and 60.");
    }

    return true;
  },
});

const monthToNumber = Number(month) - 1; // Months are zero-indexed
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
  secondToNumber,
);

type timestampType = "default" | "relative";

const timestampSelection: timestampType = await select({
  message: chalk.bold(theme.accent("Select the timestamp format:")),
  choices: [
    {
      name: chalk.white("Default"),
      value: "default",
      description: theme.hint("Show the date and time."),
    },
    {
      name: chalk.white("Relative"),
      value: "relative",
      description: theme.hint("Show time relative to now."),
    },
  ],
});

const stopSpinner = startSpinner("Generating your Discord timestamp...");
await wait(450);
const unixTime = getUnixTime(completeDate);
stopSpinner();

const timestamp =
  timestampSelection === "relative" ? `<t:${unixTime}:R>` : `<t:${unixTime}>`;

console.log(`\n${theme.success(chalk.bold("Your Discord timestamp:"))}`);
console.log(theme.success(timestamp));
console.log(theme.hint("Copy and paste it into Discord."));
