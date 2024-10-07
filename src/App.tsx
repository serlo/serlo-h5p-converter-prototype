import React from "react";

import { H5PPlayerUI, H5PEditorUI } from "@lumieducation/h5p-react";

import logo from "./logo.svg";
import "./App.css";

import { ContentService } from "./services/ContentService";

const ContentDump = (props: any) => {
  const [content, setContent] = React.useState("{}");
  const editor = props.editor;
  const contentService = props.contentService;

  return (
    <div>
      <pre>{JSON.stringify(JSON.parse(content), null, 2)}</pre>
      <button
        type="button"
        onClick={async () => {
          console.log(contentService.editorContent);
          await editor.current?.save();
          setContent(contentService.editorContent);
        }}
      >
        Save
      </button>
    </div>
  );
};

function App() {
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
      <ContentDump editor={h5pEditor} contentService={contentService} />
    </div>
  );
}

export default App;
