import { RubricItem } from "@/types";

export const criteriaTemplates: RubricItem[] = [
  {
    id: "code-correctness",
    title: "Code Correctness",
    description:
      "The code correctly implements all required functionality and passes all test cases.",
    maxPoints: 50,
  },
  {
    id: "code-efficiency",
    title: "Code Efficiency",
    description:
      "The solution uses efficient algorithms and data structures with optimal time and space complexity.",
    maxPoints: 30,
  },
  {
    id: "documentation",
    title: "Documentation",
    description:
      "Code is well-documented with appropriate comments explaining the approach and implementation details.",
    maxPoints: 20,
  },
  {
    id: "error-handling",
    title: "Error Handling",
    description: "Solution properly handles edge cases and potential errors.",
    maxPoints: 15,
  },
  {
    id: "creativity",
    title: "Creativity",
    description:
      "Solution demonstrates creative problem-solving and original thinking.",
    maxPoints: 10,
  },
];
