import React, { useEffect } from "react";
import { Editor, EditorState, ContentState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";

export { EditorState, ContentState };

interface PropTypes {
    name?: string;
    value?: string;
    onChange?: Function;
}

// Trick to fix issue with NextJS https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/universal/editor.js
const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: "",
            key: "foo",
            type: "unstyled",
            entityRanges: [],
        },
    ],
});

function RichTextEditor({ name, value, onChange }: PropTypes) {
    const [editorState, setEditorState] = React.useState(
        EditorState.createWithContent(emptyContentState)
    );

    useEffect(() => {
        if (value) {
            setEditorState(
                EditorState.createWithContent(ContentState.createFromText(value))
            );
        }
    }, []);

    return (
        <Editor
            editorKey={name}
            editorState={editorState}
            onChange={(editorState) => {
                setEditorState(editorState);
                onChange(editorState.getCurrentContent().getPlainText());
            }}
            userSelect="none"
            contentEditable={false}
        />
    );
}

export default RichTextEditor;
