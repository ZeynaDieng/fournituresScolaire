// types/nuxt.d.ts
import type { DefinePageMetaFunction } from "nuxt/app";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { NuxtApp } from "nuxt/app";

declare global {
  const definePageMeta: DefinePageMetaFunction;
  const useRoute: () => RouteLocationNormalizedLoaded;
  const useNuxtApp: () => NuxtApp;
  const useRouter: () => any;
  const navigateTo: (to: string | object) => Promise<void>;
  const $fetch: typeof globalThis.$fetch;
}

export {};
