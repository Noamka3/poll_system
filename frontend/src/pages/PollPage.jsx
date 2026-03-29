import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Title, Text, Card, Stack, TextInput,Button,Progress } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { getPollById,getPollResults,vote} from "../services/api";

function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

useEffect(() => {
  getPollById(id)
    .then(({ data }) => setPoll(data))
    .catch(() => setError("poll not found"));

  const alreadyVoted = localStorage.getItem(`voted_${id}`);
  if (alreadyVoted) {
    getPollResults(id)
      .then(({ data }) => {
        setResults(data);
        setVoted(true);
      })
      .catch(() => setError("error loading results"));
  }
}, [id]);

  const handleVote = async () => {
      if (!username.trim()) {
        return setError("Please enter your name");
      }
      if (!selectedOption) {
        return setError("Please select an option");
      }

      try {
        await vote(id, { option_id: selectedOption, username });
        localStorage.setItem(`voted_${id}`, username);
        const {data} = await getPollResults(id);
        setResults(data);
        setVoted(true);  //  הצבעה הצליחה
        setError("");   // איפוס שגיאה
      } catch (err) {
        if (err.response?.status === 409) {
          setError("this name already voted in this poll");
        } else {
          setError(err.response?.data?.error || "error vote");
        }
      }
  };
  

  if (!poll) return <Text>Loading...</Text>;

  if (voted) return (
  <Container size="sm" py="xl">

    <Title mb="xl">{poll.question}</Title>

    <Stack>
      {results.options.map((option) => (
        <Card key={option.id} padding="lg" radius="md" withBorder>
          <Text mb="xs">{option.option_text}</Text>
          <Progress value={option.percentage} mb="xs" />
          <Text c="dimmed" size="sm">
            {option.vote_count} votes — {option.percentage}%
          </Text>
        </Card>
      ))}
    </Stack>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
      <Button variant="subtle" onClick={() => navigate("/")}>
        ← back to polls
      </Button>
     <Button
       variant="subtle"
       mb="md"
       onClick={() => {
       navigator.clipboard.writeText(window.location.href);
       setCopied(true);
       setTimeout(() => setCopied(false), 2000);
       }}
     >
       {copied ? "✅ copy!" : "🔗 copy link"}
     </Button>
      <Text c="dimmed" size="sm">
        total votes: {results.total_votes}
      </Text>
    </div>
  </Container>
);

  return (
    <Container size="sm" py="xl">
      <Title mb="xs">{poll.question}</Title>
      <Text c="dimmed" mb="xl" size="sm">
        Created by: {poll.created_by}
      </Text>

      <Stack>
        {poll.options.map((option) => (
          <OptionCard key={option.id} option={option} 
           selected={selectedOption === option.id}
           onClick={() => setSelectedOption(option.id)}
          />
        ))}
      </Stack>
      <TextInput
        label="Your name"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {error && <Text c="red" mt="sm">{error}</Text>} 
 
      <Button mt="md" fullWidth onClick={handleVote}>
  vote
</Button>
<Button mt="md" variant="subtle" onClick={() => navigate("/")}>
  back to polls
</Button>
    </Container>
    
  );
}

function OptionCard({ option, selected, onClick }) {
  const { hovered, ref } = useHover();

  return (
    <Card
      ref={ref}
      padding="lg"
      radius="md"
      withBorder
      onClick={onClick}
      style={{
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        borderColor: selected ? "#fff" : hovered ? "#888" : "",
        transition: "transform 0.2s, border-color 0.2s",
      }}
    >
      <Text size="md">{option.option_text}</Text>
    </Card>
  );
}

export default PollPage;