import axios from 'axios';
import { Diary, NewDiary } from './types';

export const getAllDiaries = () => {
  return axios
    .get<Diary[]>('http://localhost:3000/api/diaries')
    .then(response => response.data)
};

export const createDiary = async (object: NewDiary, logError: (value: React.SetStateAction<string>) => void) => {
  const url = 'http://localhost:3000/api/diaries';
  const data = object;
  try {
    const response = await axios.post<Diary>(url, data);
    return response.data;
  } catch (error) {
    let message;
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data.slice(21);
    } else {
      message = String(error);
    };
    console.log('error message', message);
    logError(message);
  };
};
