import React from "react";
import Parts from "./Parts"


const Content = ({parts})=>{
    return(
        <div >
            {parts.map(part=> <Parts key={part.id} title={part.name} exercises={part.exercises}/>)}
            <p>Total exercises: {parts.reduce((sum, part)=> sum+part.exercises,0)}</p>
        </div>
    )
}

export default Content;