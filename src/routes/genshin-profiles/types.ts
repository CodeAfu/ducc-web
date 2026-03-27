
export interface AllGenshinProfilesResponse {
  id: number;
  name: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export interface GenshinProfileStats {
  char_count: number;
  element_counts: ElementStat[]
}

export interface ElementStat {
  element_name: string;
  count: number
}

export interface ElementResponse {
  id: number;
  name: string;
  icon_url: string;
}

export interface CharacterResponse {
  char_id: number;
  name: string;
  level: number;
  constellation: number;
  talent_na: number;
  talent_e: number;
  talent_q: number;
  char_notes: string;
  element_name: string;
  element_icon: string;
}

export interface ProfileResponse {
  id: number;
  name: string;
  notes: string;
  characters: CharacterResponse[];
}

export interface CharacterListResponse {
  id: number;
  name: string;
  notes: string;
  stars: number;
  element_name: string;
  element_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface AddCharacterToProfileRequest {
  level: number;
  constellation: number;
  talent_na: number;
  talent_e: number;
  talent_q: number;
  notes: string;
}
