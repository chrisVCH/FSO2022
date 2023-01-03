import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Displayinfo = ({text, anecdotes, voted, selected}) => {
  if ( text === 'Anecdote of the day') {
    const foundind = voted.findIndex( x => x.ind === selected)
    const votecnt = voted[foundind].val  
    return (
      <>
      <h1>{text}</h1>
      {anecdotes[selected]} <br />
      has {votecnt} votes <br />
      </>
    )
  }

  const vote1 = [...voted]
  const mostvotedtext = anecdotes[vote1[0].ind]
  const mostvotedcnt = vote1[0].val
  
  if (mostvotedcnt === 0)
    return (
      <>
      <h1>{text}</h1>
      There is no vote yet<br />
      </>
  )

  return (
      <>
      <h1>{text}</h1>
      {mostvotedtext} <br />
      has {mostvotedcnt} votes <br />
      </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const len = anecdotes.length

  const vote = new Array(len).fill(0)
  // make vote list with indices and values
  const indexedvote = vote.map((element,index) => ({ind: index, val: element}))

  const [voted, setVoted] = useState(indexedvote)

  const text1 = 'Anecdote of the day'
  const text2 = 'Anecdote with most votes'
    
  return (
    <div>
      <Displayinfo text={text1} anecdotes={anecdotes} voted={voted} selected={selected} />
      <Button handleClick = {() => { 
                                      const votecpy = [...voted]
                                      const foundkey = votecpy.findIndex(x => x.ind === selected)
                                      votecpy[foundkey].val += 1
                                      votecpy.sort((a, b) => (b.val - a.val))
                                      setVoted(votecpy);
                                   }
                            } 
              text="vote" />
      <Button handleClick = {() => { 
                                     let r1 = Math.floor(Math.random() * len)
                                     do { 
                                      r1 = Math.floor(Math.random() * len)
                                     } while (anecdotes[selected] === anecdotes[r1])

                                     setSelected(r1)
        
                                   }
                            } 
              text="next anecdote" />
      <Displayinfo text={text2} anecdotes={anecdotes} voted={voted} selected={selected}/>                                 
    </div>
  )
}

export default App