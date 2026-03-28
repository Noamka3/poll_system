import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getAllPolls} from "../services/api";

function HomePage(){
  const [polls,setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() =>{
    getAllPolls().then(({data}) => { setPolls(data)});
  },[]);

  return(
    <div>
      <h1>Poll System</h1>
      {polls.map((poll) => (
        <div key={poll.id} onClick={() => navigate(`/polls/${poll.id}`)}>
          <p>{poll.question}</p>
          <p> created by : {poll.created_by}</p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;