import React from "react";

import { H5PPlayerUI, H5PEditorUI } from "@lumieducation/h5p-react";

import { SerloRenderer, SerloRendererProps } from '@serlo/editor'

import logo from "./logo.svg";
import "./App.css";

import { ContentService } from "./services/ContentService";

import { SerloPlugin, h5p2serlo } from "./SerloState";


const initialState: SerloPlugin = {
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

interface ContentDumpProps {
    editor: React.RefObject<H5PEditorUI>;
    contentService: ContentService;
    updateRenderer: React.Dispatch<React.SetStateAction<SerloPlugin>>;
}

const ContentDump = (props: ContentDumpProps) => {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          props.editor.current?.save().then(() => {
              props.updateRenderer(h5p2serlo(JSON.parse(props.contentService.editorContent)));
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
