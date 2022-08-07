import React from "react";

const Parts = ({title, exercises})=>{
    return (
        <div>
            <h2>{title}</h2>
            <p>This part has {exercises} exercises</p>
        </div>
    )
}

export default Parts