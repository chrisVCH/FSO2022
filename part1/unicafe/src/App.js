import React, { useState } from 'react'

const Statistics = (props) => { 
    
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) 
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )

  return (
    <>
    <h1>statistics</h1>
    <table>
      <tbody>
        <StatisticLine text="good" value ={props.good} sign={props.sign2} />
        <StatisticLine text="neutral" value ={props.neutral} sign={props.sign2} />
        <StatisticLine text="bad" value ={props.bad} sign={props.sign2}  />
        <StatisticLine text="all" value ={props.good+props.neutral+props.bad} sign={props.sign2} />
        <StatisticLine text="average" value ={props.average} sign={props.sign2} />
        <StatisticLine text="positive" value ={props.ppercent} sign={props.sign1} />
      </tbody>
    </table>   
    </>
  )
}

const StatisticLine = (props) => (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}{props.sign}</td>
    </tr>
)

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
 
  const average = good + neutral + bad === 0 ? 0: (good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad)
  const ppercent = good + neutral + bad === 0 ? 0: (good * 100) / (good + neutral + bad)
  const sign1 = "%"
  const sign2 = ""

  return (
    <>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good+1)} text="good" />
      <Button handleClick={() => setNeutral(neutral+1)} text="neutral" />
      <Button handleClick={() => setBad(bad+1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} average={average} ppercent={ppercent} sign1={sign1} sign2={sign2} />
    </>
  )
}

export default App