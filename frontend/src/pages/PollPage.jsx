import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPollById } from "../services/api";

function PollPage() {
    const {id} = useParams();
    const [poll,setPoll] = useState(null);

    useEffect(() => {
        getPollById(id).then(({data}) => setPoll(data));
    },[id]);
    if (!poll) return <div>Loading...</div>;
    
    return (
    <div>
      <h1>{poll.question}</h1>
      <p>Created by: {poll.created_by}</p>
      {poll.options.map((option) => (
        <div key={option.id}>
          <p>{option.option_text}</p>
        </div>
      ))}
    </div>
  );
}

export default PollPage;