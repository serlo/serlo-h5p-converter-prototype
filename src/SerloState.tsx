type SerloPlugin = TextPlugin | RowsPlugin | ExercisePlugin | MultipleChoicePlugin;

type SlateValue = Heading | Paragraph;

interface Heading {
    type: 'h';
    level: 1 | 2 | 3;
    children: CustomText[];
}

interface Paragraph {
    type: 'p';
    children: CustomText[];
}

interface CustomText {
    text: string;
    strong?: true;
    em?: true;
    code?: true;
    color?: number;
}

interface TextPlugin {
    plugin: "text";
    state: Array<SlateValue>;
}

interface RowsPlugin {
    plugin: "rows";
    state: Array<SerloPlugin>;
}

interface ExercisePlugin {
    plugin: "exercise";
    state: {
        content: SerloPlugin;
        interactive: SerloPlugin;
    }
}

interface MultipleChoicePlugin {
    plugin: "scMcExercise";
    state: {
        // single or multiple choice
        isSingleChoice: boolean,
        // multiple answers can be entered
        answers: Array<MCAnswer>;
    }
}

interface MCAnswer {
    content: SerloPlugin;
    isCorrect: boolean;
    feedback: SerloPlugin;
}

function h5p2serlo(content: any): SerloPlugin {
    return {
        plugin: "exercise",
        // The exercise plugin combines the task description and the responses
        state: {
            // The task
            content: {
                plugin: "rows",
                state: [
                    {
                        plugin: "text",
                        state: [
                            {
                                type: "p",
                                children: [{ text: content["params"]["params"]["question"]}],
                            },
                        ],
                    }
                ]
            },
            // The responses, either of type scMcExercise or inputExercise
            interactive: {
                plugin: "scMcExercise",

                // // The scmc exercise contains only the response part of the exercise (the task is a separate content)
                state: {
                    // single or multiple choice
                    isSingleChoice: false,
                    // multiple answers can be entered
                    answers: content["params"]["params"]["answers"].map((answer: any) => {
                        return {
                            // each answer contains a text content
                            content: {
                                plugin: "text",
                                state: [
                                    {
                                        type: "p",
                                        children: [{ text: answer["text"] }],
                                    },

                                ],
                            },
                            // flag whether answer is correct or false
                            isCorrect: answer["correct"],
                            // text feedback for the user
                            feedback: {
                                plugin: "text",
                                state: [
                                    {
                                        type: "p",
                                        children: [{ text: answer["tipsAndFeedback"]["chosenFeedback"] }],
                                    },
                                ],
                            }
                        };
                    }),
                },
            }
        }
    };
}

export type { SerloPlugin };
export { h5p2serlo };
