import { useState, useEffect } from "react";
import { Diary, NewDiary, Weather, Visibility } from "./types";
import { getAllDiaries, createDiary } from "./diaryService";
import Notify from "./components/Notify";
import RadioButtonGroup from "./components/RadioButtonGroup";

const App = () => {
  
  const weatherOptions = Object.entries(Weather).map(e => ({ label: e[0], value: e[1] }));
  const visibilityOptions = Object.entries(Visibility).map(e => ({ label: e[0], value: e[1] }));

  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState(visibilityOptions[0].value);
  const [newWeather, setNewWeather] = useState(weatherOptions[0].value);
  const [newComment, setNewComment] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    })
  }, [])

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const diaryToAdd = {
      date: newDate,
      weather: newWeather as Weather,
      visibility: newVisibility as Visibility,
      comment: newComment
    }

    createDiary(diaryToAdd as NewDiary, setErrorMessage).then(data => {
      if (data) {
        setDiaries(diaries.concat(data as Diary));
        setNewDate('');
        setNewVisibility(visibilityOptions[0].value);
        setNewWeather(weatherOptions[0].value);
        setNewComment('');
      }
    })
  };

  const isVisibilityChecked = (value: string): boolean => {
    return value === newVisibility;
  }

  const visibilitySelectionHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewVisibility(event.target.value as Visibility);
  };

  const isWeatherChecked = (value: string): boolean => {
    return value === newWeather;
  }

  const weatherSelectionHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewWeather(event.target.value as Weather);
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <Notify errorMessage={errorMessage} /><br />
      <form onSubmit={diaryCreation}>
        <label>
          date:
          <input type="date" onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setNewDate(event.target.value)} /> 
        </label>
        <br />
        visiblity &ensp; 
        <RadioButtonGroup
          grouplabel="Visiblity"
          key="Visibility"
          options={visibilityOptions}
          isChecked={isVisibilityChecked}
          onChange={visibilitySelectionHandler}
        />
        <br />
        weather &ensp;
        <RadioButtonGroup
          grouplabel="Weather"
          key="Weather"
          options={weatherOptions}
          isChecked={isWeatherChecked}
          onChange={weatherSelectionHandler}
        />
        <br />
        comment
        <input
          key="comment"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        /><br />
        <button type='submit'>add</button>
      </form>
      <h2>Diary entries</h2>
      <div>
        {diaries.map(diary => <div key={diary.id}>
          <b>{diary.date}</b><br /><br />
          visibility: {diary.visibility} <br />
          weather: {diary.weather} <br />
          comment: {diary.comment} <br /><br />
        </div>)}
      </div>
    </div>
  )
}

export default App;