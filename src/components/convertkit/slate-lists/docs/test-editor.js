import React, { useRef } from "react";
import Editor from "../../shared/test-editor";
// import {
//   OrderedList,
//   UnorderedList,
//   Indent,
//   Outdent
// } from "../../shared/test-editor/icons";
// import Button from "../../shared/test-editor/button";
import Lists from "../src";
import value from "./test-value";
import { Button, Icon, Toolbar } from "../../../Components";

const plugins = [Lists()];

const TestEditor = () => {
  const editor = useRef(null);

  const toggleUnorderedList = event => {
    event.preventDefault();
    editor.current.toggleList({ type: "unordered-list" });
  };

  const toggleOrderedList = event => {
    event.preventDefault();
    editor.current.toggleList({ type: "ordered-list" });
  };

  const indent = event => {
    event.preventDefault();
    editor.current.increaseListItemDepth();
  };

  const outdent = event => {
    event.preventDefault();
    editor.current.decreaseListItemDepth();
  };

  return (
    <div> 
        <div className="container">
            <div className="dashboard">
                <Toolbar>
                    <Button onMouseDown={toggleUnorderedList}>
                      <Icon>format_list_bulleted</Icon>
                    </Button>
                    <Button onMouseDown={toggleOrderedList}>
                      <Icon>format_list_numbered</Icon>
                    </Button>
                    <Button onMouseDown={indent}>
                      <Icon>format_indent_increase</Icon>
                    </Button>
                    <Button onMouseDown={outdent}>
                      <Icon>format_indent_decrease</Icon>
                    </Button>
                    </Toolbar>
                <Editor ref={editor} plugins={plugins} initialValue={value} />
            </div>
        </div>
    </div>
  );
};

export default TestEditor;
