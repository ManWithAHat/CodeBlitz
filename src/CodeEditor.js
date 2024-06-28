import { Editor } from "@monaco-editor/react";

const CodeEditor = () =>{
    return(
        <div>
        <p>Editor view</p>
        <Editor
        height="90vh"
        theme="vs-dark"
        defaultLanguage="python"
        defaultValue="#Comment"
        language="javascript"
        value="\\comment"
        />
        </div>
    )
}

export default CodeEditor;