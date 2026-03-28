import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Title, Text, Card, Stack } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { getPollById } from "../services/api";

function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    getPollById(id).then(({ data }) => setPoll(data));
  }, [id]);

  if (!poll) return <Text>Loading...</Text>;

  return (
    <Container size="sm" py="xl">
      <Title mb="xs">{poll.question}</Title>
      <Text c="dimmed" mb="xl" size="sm">
        Created by: {poll.created_by}
      </Text>

      <Stack>
        {poll.options.map((option) => (
          <OptionCard key={option.id} option={option} />
        ))}
      </Stack>
    </Container>
  );
}

function OptionCard({ option }) {
  const { hovered, ref } = useHover();

  return (
    <Card
      ref={ref}
      padding="lg"
      radius="md"
      withBorder
      style={{
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        borderColor: hovered ? "#fff" : "",
        transition: "transform 0.2s, border-color 0.2s",
      }}
    >
      <Text size="md">{option.option_text}</Text>
    </Card>
  );
}

export default PollPage;