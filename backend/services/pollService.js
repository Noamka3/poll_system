const pool = require('../config/db');

const getAllPolls = async() => {
    const polls = await pool.query('SELECT * FROM polls');
    return polls.rows;
};

const createPoll = async(question,created_by,options) =>{
    const client = await pool.connect();
    try{
        await client.query("BEGIN"); //כמו עם החשבון שלמדנו בכיתה אם ירד מחשבון A ונוסף לחשבון B
        const pollResult = await client.query(
            "INSERT INTO polls (question,created_by) VALUES ($1,$2) RETURNING *", // SQL Injection הגנה מפני
            [question,created_by]
        );
        const poll = pollResult.rows[0]; // ← שומרים את כל האובייקט
        const pollId = poll.id;    

    //Options הכנסת האפשרויות
    for(const option of options){
        await client.query(
            "INSERT INTO poll_options (poll_id,option_text) VALUES ($1,$2)",
            [pollId,option]
        );
    }

    await client.query("COMMIT");
    return poll;

    } catch (error) {
    await client.query("ROLLBACK"); // אם יש תקלה אז לא מכניסים כלום
    throw error;
    }
    finally{
        client.release(); // שחרור החיבור
    }
};

const getPollById = async(pollId) => {
  const pollResult = await pool.query(
    "SELECT * FROM polls WHERE id = $1",
    [pollId]
  );
  if (pollResult.rows.length === 0) return null;

  const optionsResult = await pool.query(
    "SELECT * FROM poll_options WHERE poll_id = $1",
    [pollId]
  );

  return {
    ...pollResult.rows[0],
    options: optionsResult.rows,
  };

};

const vote = async(pollId,optionId,username) => {
    const optionCheck = await pool.query(
        "SELECT * FROM poll_options WHERE id = $1 AND poll_id = $2", //בדיקה שהאופציה קיימת ושייכת לסקר
        [optionId,pollId]
    );
    if (optionCheck.rows.length > 0) {
        throw { status: 409, message: "User has already voted in this poll" };
    }

    if (optionCheck.rows.length === 0) {
        throw { status: 400, message: "Option does not belong to this poll" };
    }

    await pool.query(
        "INSERT INTO votes (poll_id, option_id, username) VALUES ($1, $2, $3)",
        [pollId, optionId, username]
    );

};

const getPollResults = async(pollId) => {
    const result = await pool.query(
    `SELECT po.option_text,COUNT(v.id)::int AS vote_count
     FROM poll_options po
     LEFT JOIN votes v ON v.option_id = po.id
     WHERE po.poll_id = $1
     GROUP BY po.id, po.option_text
     ORDER BY po.id ASC`,
     [pollId]
    );

    const options = result.rows;
    const totalVotes = options.reduce((sum, o) => sum + o.vote_count, 0);


  return {
    poll_id: pollId,
    total_votes: totalVotes,
    options: options.map((o) => ({ //אחוז לכל אפשרות
      ...o,
      percentage: totalVotes > 0
        ? Math.round((o.vote_count / totalVotes) * 100)
        : 0,
    })),
  };

};




module.exports = {
    getAllPolls,
    createPoll,
    getPollById,
    vote,
    getPollResults,
};