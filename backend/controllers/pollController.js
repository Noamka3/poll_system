const pollService = require('../services/pollService');

const getAllPolls = async(req,res,next) => {
    try{
        const polls = await pollService.getAllPolls();
        res.json(polls);
    } catch (error) {
        next(error);
    }
};

const createPoll = async(req,res,next) => {
    try {
        const {question,created_by,options} = req.body;

        if(!question || !created_by){
            return res.status(400).json({error:"question and created_by are required"});
        }
        if (!Array.isArray(options) || options.length < 2 || options.length > 8) {
            return res.status(400).json({ error: "options must be between 2 and 8" });
        }  
        const poll = await pollService.createPoll(question,created_by,options); 
        res.status(201).json(poll);
    } catch(error){
        next(error);
    }
};


const parseId = (id, res) => {
  const parsed = parseInt(id);
  if (isNaN(parsed)) {
    res.status(400).json({ error: "Invalid poll ID" });
    return null;
  }
  return parsed;
};

const getPollById = async(req,res,next) => {
    try{
        const id = parseId(req.params.id, res);
        if (id === null) return;

        const poll = await pollService.getPollById(id);
        if(!poll)
        {
            return res.status(404).json({error:"poll not found"});
        }
        res.json(poll);

    } catch(error){
        next(error);
    }
}

const vote = async (req, res, next) => {
  try {
    const id = parseId(req.params.id, res);
    if (id === null) return;

    const { option_id, username } = req.body;
    await pollService.vote(id, option_id, username);
    res.status(201).json({ message: "Vote recorded successfully" });
  } catch (error) {
    next(error);
  }
};

const getPollResults = async (req, res,next) => {
  try {
    const id = parseId(req.params.id, res);
    if (id === null) return;

    const results = await pollService.getPollResults(id);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPolls,
   createPoll,
   getPollById,
   vote,
   getPollResults,
};