/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
    "keyframes-name-pattern": "^[a-z][a-zA-Z0-9]+$",
  },
};

export default config;
