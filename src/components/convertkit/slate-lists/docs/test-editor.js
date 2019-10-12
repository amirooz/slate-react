import React, { useRef } from "react";
import Editor from "../../shared/test-editor";
import {
  OrderedList,
  UnorderedList,
  Indent,
  Outdent
} from "../../shared/test-editor/icons";
// import Button from "../../shared/test-editor/button";
import Lists from "../src";
import value from "./test-value";
import { Button, Toolbar } from "../../../editor/Components";

const plugins = [Lists()];

const TestEditor = () => {
  const editor = useRef(null);

  const toggleUnorderedList = event => {
    event.preventDefault();
    editor.current.toggleList();
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
    <div className="container">
        <div className="dashboard">
            <Toolbar>
              <Button onMouseDown={toggleUnorderedList} >
                <UnorderedList />
              </Button>
              <Button onMouseDown={toggleOrderedList} >
                <OrderedList />
              </Button>
              <Button onMouseDown={indent} >
                <Indent />
              </Button>
              <Button onMouseDown={outdent} >
                <Outdent />
              </Button>
            </Toolbar>
            <Editor ref={editor} plugins={plugins} initialValue={value} />
        </div>
    </div>
  );
};

export default TestEditor;