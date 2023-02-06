import Part from "./Part"

const Content = ({content}) => {
    const total = content.reduce((s, p) => s + p.exercises, 0)
    return (
        <>
        {content.map(con => <Part name={con.name} exercises={con.exercises} key={con.id}/>)}
        <b>total of {total} exercises</b>
        </>

    )
}

export default Content
