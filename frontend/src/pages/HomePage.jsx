import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title, Text, Card, Stack, Button, TextInput } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { getAllPolls, createPoll } from "../services/api";

function HomePage() {
  const [polls, setPolls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getAllPolls()
      .then(({ data }) => setPolls(data))
      .catch(() => setFormError("error loading polls"));
  }, []);

 const handleCreate = async () => {
    if (!question.trim()) {
    setFormError("please enter a question");
    return;
  }
  if (!createdBy.trim()) {
    setFormError("please enter your name");
    return;
  }
  if (options.some((o) => o.trim() === "")) {
    setFormError("please enter all options");
    return;
  }
  try {
    await createPoll({ question, created_by: createdBy, options });
    setShowForm(false);
    setQuestion("");
    setCreatedBy("");
    setOptions(["", ""]);
    const { data } = await getAllPolls();
    setPolls(data);
  } catch (err) {
    setFormError(err.response?.data?.error || "error creating poll");
  }
};


  return (
    <Container size="sm" py="xl">
      <Title mb="xs">🗳️ Poll System</Title>
      <Text c="dimmed" mb="xl">select a poll to vote</Text>

      {/*"Create Poll"*/}
      <Button mb="xl" onClick={() => {
        setShowForm(!showForm);
        setQuestion("");
        setCreatedBy("");
        setOptions(["", ""]);
        setFormError("");
      }}>
        {showForm ? "close" : "create new poll"}
      </Button>
      {showForm && (
        <Card padding="lg" radius="md" withBorder mb="xl">
          <Title order={3} mb="md">create new poll</Title>

          <TextInput
            label="question"
            placeholder="what is your question?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            mb="sm"
          />

          <TextInput
            label="created by"
            placeholder="your name"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            mb="sm"
          />

          <Title order={5} mb="xs">options</Title>

          {options.map((option, index) => (
            <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <TextInput
                style={{ flex: 1 }}
                placeholder={`option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
              />
              <Button
                color="red"
                variant="subtle"
                disabled={options.length <= 2}
                onClick={() => setOptions(options.filter((_, i) => i !== index))}
              >
                ✕
              </Button>
            </div>
          ))}

          <Button
            variant="subtle"
            disabled={options.length >= 8}
            onClick={() => setOptions([...options, ""])}
            mt="xs"
          >
            + הוסף אפשרות
          </Button>

          {options.length >= 8 && (
            <Text c="red" size="sm" mt="xs">Maximum 8 options</Text>
          )}

          {options.length === 2 && (
            <Text c="dimmed" size="sm" mt="xs">Minimum 2 options</Text>
          )}
          <Button 
            fullWidth 
            mt="md" 
            onClick={handleCreate}
          >
            צור סקר
          </Button>
          {formError && <Text c="red" mt="sm">{formError}</Text>}

        </Card>
      )}

      <Stack>
        {polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onClick={() => navigate(`/polls/${poll.id}`)}
          />
        ))}
      </Stack>
    </Container>
  );
}

function PollCard({ poll, onClick }) {
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
        borderColor: hovered ? "#fff" : "",
        transition: "transform 0.2s, border-color 0.2s",
      }}
    >
      <Title order={3}>{poll.question}</Title>
      <Text c="dimmed" size="sm" mt="xs">
        Created by: {poll.created_by}
      </Text>
    </Card>
  );
}

export default HomePage;