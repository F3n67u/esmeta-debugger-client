import React from "react";
import Editor from "react-simple-code-editor";
import { v4 as uuid } from "uuid";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "../styles/JSEditor.css";
import { Typography, Paper } from "@material-ui/core";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "../store";
import { edit } from "../store/reducers/JS";
import { AppState } from "../store/reducers/AppState";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  js: st.js,
  appState: st.appState.state,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  edit: (code: string) => dispatch(edit(code)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type JSEditorProps = ConnectedProps<typeof connector>;

class JSEditor extends React.Component<JSEditorProps> {
  onCodeChange(code: string) {
    if (this.props.appState === AppState.JS_INPUT) this.props.edit(code);
  }
  private genMarker(needSpace: boolean): [string, string] {
    const space = "\n";
    const genUid = () => {
      const marker = `__${uuid().replaceAll("-", "_")}__`;
      return needSpace ? space + marker + space : marker;
    };

    return [genUid(), genUid()];
  }
  highlightWithLine(code: string, start = -1, end = -1): string {
    let highlighted: string;
    // use highlighting when start, end index is given
    if (start >= 0 && end >= 0 && start != end) {
      const [startMarker, endMarker] = this.genMarker(end - start !== 1);
      const marked =
        code.slice(0, start) +
        startMarker +
        code.slice(start, end) +
        endMarker +
        code.slice(end, code.length);
      console.log(marked);
      highlighted = highlight(marked, languages.js, "js")
        .replace(startMarker, "<mark>")
        .replace(endMarker, "</mark>");
      console.log(highlighted);
    } else highlighted = highlight(code, languages.js, "js");
    // decorate with line info
    return highlighted
      .split("\n")
      .map((l, idx) => {
        const codeStr = `${l}`;
        return (
          `<span class="editor-line" onclick="console.log('test')">${
            idx + 1
          } |</span>` + codeStr
        );
      })
      .join("\n");
  }

  render() {
    const { code, start, end } = this.props.js;
    return (
      <Paper className="editor-container" variant="outlined">
        <Typography variant="h6">JavaScript</Typography>
        <div className="editor-wrapper">
          <Editor
            value={code}
            onValueChange={code => this.onCodeChange(code)}
            highlight={code => this.highlightWithLine(code, start, end)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
            textareaId="editor-textarea"
            className="editor"
          />
        </div>
      </Paper>
    );
  }
}

export default connector(JSEditor);
