export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV: "production" | "development";
      PORT: string | undefined;
    }
  }
}


// process.on("uncaughtException", (e) => {
//   console.log("uncaught exception.. exiting.. ", e);
//   process.exit();
// });

// process.on("unhandledRejection", (e) => {
//   console.log("uncaught exception.. exiting.. ", e);
//   process.exit();
// });
