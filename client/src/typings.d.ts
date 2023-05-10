import { API } from "../electron/preload/index";

declare module "*.module.css";
declare module "*.module.scss";

declare global {
  interface Window {
    api: typeof API;
  }
}
