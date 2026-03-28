import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title, Text, Card, Stack } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { getAllPolls } from "../services/api";

function HomePage() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPolls().then(({ data }) => setPolls(data));
  }, []);

  return (
    <Container size="sm" py="xl">
      <Title mb="xs">🗳️ Poll System</Title>
      <Text c="dimmed" mb="xl">select a poll to vote</Text>

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