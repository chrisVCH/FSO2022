export interface InputElementProps {
  label: string;
  type: string;
  name: string;
  value: string;
  isChecked: (value: string) => boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface InputOption {
  label: string;
  value: string;
}

export interface InputOptionGroup {
  grouplabel: string;
  options: InputOption[];
  isChecked: (value: string) => boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export enum Weather {
    Sunny = 'sunny',
    Rainy = 'rainy',
    Cloudy = 'cloudy',
    Stormy = 'stormy',
    Windy = 'windy',
  }
  
  export enum Visibility {
    Great = 'great',
    Good = 'good',
    Ok = 'ok',
    Poor = 'poor',
  }
  
  export interface Diary {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment: string;
  }
  
  export type NewDiary = Omit<Diary, 'id'>

  export interface NotifyProps {
    errorMessage: string
  }

