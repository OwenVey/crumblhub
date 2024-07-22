/* eslint-disable @typescript-eslint/no-explicit-any */
const log = (message: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]`, message);
};

const error = (message: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}]`, message);
};

const warn = (message: any) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}]`, message);
};

export { error, log, warn };
