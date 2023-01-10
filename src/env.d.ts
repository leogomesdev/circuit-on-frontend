declare namespace NodeJS {
  /** Merge declaration with `process` in order to override the global-scoped env. */
  export interface ProcessEnv {
    /**
     * Built-in environment variable.
     * @see Docs https://github.com/chihab/ngx-env#ng_app_env.
     */
    readonly NG_APP_ENV: string;

    // Add your environment variables below
    NG_APP_BACKEND_BASE_URL: string;
    NG_APP_IMAGE_CATEGORIES: string;
    NG_APP_OKTA_ISSUER: string;
    NG_APP_OKTA_CLIENT_ID: string;
    NG_APP_OKTA_REDIRECT_URI: string;
    NG_APP_VIEW_PAGE_FUTURE_ITEMS: string;
    NG_APP_LIST_PAGE_FUTURE_ITEMS: string;
    NG_APP_SCHEDULES_LIST_DISPLAY_ONLY_FUTURE: string;
  }
}
