import React from "react";

import { H5PPlayerUI, H5PEditorUI } from "@lumieducation/h5p-react";

import { SerloRenderer, SerloRendererProps } from '@serlo/editor'

import logo from "./logo.svg";
import "./App.css";

import { ContentService } from "./services/ContentService";

const initialState = {
  plugin: "rows",
  state: [
    {
      plugin: "text",
      state: [
        {
          type: "h",
          level: 1,
          children: [{ text: "Frage erstellen und anschließend auf Render klicken!" }],
        },
      ],
    },
  ],
};

function h5p2serlo(content: any) {
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
                                level: 1,
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

const ContentDump = (props: any) => {
  const editor = props.editor;
  const contentService = props.contentService;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          console.log(contentService.editorContent);
          editor.current?.save().then(() => {
              props.updateRenderer(h5p2serlo(JSON.parse(contentService.editorContent)));
          });
        }}
      >
        Render
      </button>
    </div>
  );
};

function App() {
  const [state, setState] = React.useState(initialState);
  const contentService = new ContentService("/h5p");
  const h5pEditor: React.RefObject<H5PEditorUI> = React.createRef();
  return (
    <div className="App">
      <H5PEditorUI
        contentId="new"
        ref={h5pEditor}
        loadContentCallback={contentService.getEdit}
        saveContentCallback={contentService.save}
        onSaved={(contentId: string, metadata: any) => {
          console.log(contentId);
        }}
        //onSaveError = { (message: string) => {console.log(message);} }
      />
      <ContentDump editor={h5pEditor} contentService={contentService} updateRenderer={setState} />
      <SerloRenderer
        state={state}
        editorVariant="serlo-org"
      />
    </div>
  );
}

export default App;
