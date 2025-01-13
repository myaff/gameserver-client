import type { BooleanString, BooleanStringNumber } from "./common.model";

export interface GameDTO {
  steamId: string;
  name: string;
  description: string;
  gameSteamId: string;
  apiToken: string;
  status: GameSupportStatus;
}

export enum GameSupportStatus {
  PLANNED = 'PLANNED',
  FULL = 'FULL',
  INSTALL = 'INSTALL',
}

export enum GameInstallationStatus {
  INSTALLED = 'INSTALLED',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  INSTALLATION_STARTED = 'INSTALLATION_STARTED',
  INSTALLATION_FAILED = 'INSTALLATION_FAILED',
}

export enum GameStatus {
  STOPPED = 'STOPPED',
  STARTED = 'RUNNING',
}

export enum GameServerStatus {
  ON = 'start',
  OFF = 'stop',
}

export interface ServerGameDTO {
  game: GameDTO;
  status: GameInstallationStatus;
}

export interface WorldDTO {
  worldName: string;
  comment: string;
}

export interface BackupDTO {
  saveName: string;
  createDate: string;
  comment: string;
}

export interface BackupFileDTO {
  fileName: string;
  createDate: string;
  comment: string;
}

export interface CommentDTO {
  comment: string;
  attachedTo: string;
}

export interface GameDetailsDTO extends SteamGameDetailsDTO {
  logo?: string;
  keyart?: string;
  logoPosition?: string;
}

export interface SteamGameDetailsDTO {
  type: string;
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  controller_support?: string;
  dlc: number[];
  detailed_description: string;
  short_description: string;
  about_the_game: string;
  supported_languages: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  website: string;
  pc_requirements: SteamGameRequirenments;
  mac_requirements: SteamGameRequirenments;
  linux_requirements: SteamGameRequirenments;
  developers: string[];
  publishers: string[];
  price_overview: SteamPrice;
  packages: number[];
  package_groups: SteamPackage[];
  platforms: SteamPlatforms;
  metacritic?: SteamMetacritic;
  categories: SteamCategory[];
  genres: SteamGenre[];
  screenshots: SteamScreenshot[];
  movies: SteamMovie[];
  recommendations: { total: number };
  achievements?: {
    total: number;
    highlighted: SteamAchievement[];
  };
  release_date: SteamReleaseDate;
  support_info: {
    url: string;
    email: string;
  };
  background: string;
  background_raw: string;
  ratings: { [key: string]: SteamRating };
  content_descriptors: {
    ids: string[];
    notes: string | null;
  }
  reviews?: string;
  legal_notice?: string;
}

export interface SteamGameRequirenments {
  minimum: string;
  recommended?: string;
}

export interface SteamPrice {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
}

export interface SteamPackage {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: number;
  is_recurring_subscription: string;
  subs: SteamPackageSub[];
}

export interface SteamPackageSub {
  packageid: number;
  percent_savings_text: string;
  percent_savings: number;
  option_text: string;
  option_description: string;
  can_get_free_license: string;
  is_free_license: boolean;
  price_in_cents_with_discount: number;
}

export interface SteamPlatforms {
  windows: boolean;
  mac: boolean;
  linux: boolean;
}

export interface SteamMetacritic {
  score: number;
  url: string;
}

export interface SteamCategory {
  id: number;
  description: string;
}

export interface SteamGenre {
  id: string;
  description: string;
}

export interface SteamScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface SteamMovie {
  id: number;
  name: string;
  thumbnail: string;
  webm: SteamMovieFormat,
  mp4: SteamMovieFormat,
  highlight: boolean;
}

export interface SteamMovieFormat {
  480: string;
  max: string;
}

export interface SteamAchievement {
  name: string;
  path: string;
}

export interface SteamReleaseDate {
  coming_soon: boolean;
  date: string;
}

export interface SteamRating {
  rating: string;
  descriptors?: string;
  display_online_notice?: BooleanString;
  use_age_gate?: BooleanString | BooleanStringNumber;
  required_age?: string;
  rating_generated?: BooleanStringNumber;
  banned?: BooleanStringNumber;
  interactive_elements?: string;
}