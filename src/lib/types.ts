type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface ApiResponse<T, E = Error> {
  success: boolean;
  data: T;
  message?: string;
  error?: E;
}

export type NavGroup = "tools" | "games";

export interface MenuItem {
  href: string;
  label: string;
  protected?: boolean;
  group?: NavGroup;
}

export interface MenuDropdown {
  label: string;
  links: MenuItem[];
}

export type MenuElement = MenuItem | MenuDropdown;
