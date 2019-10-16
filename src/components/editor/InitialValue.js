import { Value } from 'slate';

const initialValue = Value.fromJSON({
  object: "value",
  document: {
    object: "document",
    nodes: [
      {
        "object": "block",
        "type": "paragraph",
        "nodes": [
          {
            "object": "text",
            "text":
              "In addition to block nodes, you can create inline nodes, like "
          },
          {
            "object": "inline",
            "type": "link",
            "data": {
              "href": "https://en.wikipedia.org/wiki/Hypertext"
            },
            "nodes": [
              {
                "object": "text",
                "text": "hyperlinks"
              }
            ]
          },
          {
            "object": "text",
            "text": "!"
          }
        ]
      },
      {
        "object": "block",
        "type": "paragraph",
        "nodes": [
          {
            "object": "text",
            "text":
              "This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected."
          }
        ]
      },
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "This is editable "
          },
          {
            object: "text",
            text: "rich",
            marks: [{ "type": "bold" }]
          },
          {
            object: "text",
            text: " text, "
          },
          {
            object: "text",
            text: "much",
            marks: [{ "type": "italic" }]
          },
          {
            object: "text",
            text: " better than a "
          },
          {
            object: "text",
            text: "<textarea>",
            marks: [{ "type": "code" }]
          },
          {
            object: "text",
            text: "!"
          }
        ]
      },
      {
        object: "block",
        "type": "paragraph",
        "nodes": [
          {
            object: "text",
            text:
              "Since it's rich text, you can do things like turn a selection of text "
          },
          {
            object: "text",
            text: "bold",
            marks: [{ "type": "bold" }]
          },
          {
            object: "text",
            text:
              ", or add a semantically rendered block quote in the middle of the page, like this:"
          }
        ]
      },      
      {
        object: "block",
        "type": "block-quote",
        "nodes": [
          {
            object: "text",
            text: "A wise quote."
          }
        ]
      },
      {
        object: "block",
        type: "image",
        data: {
          "src":
            "https://media.licdn.com/dms/image/C4D0BAQF5fQA0M1a-uA/company-logo_200_200/0?e=2159024400&v=beta&t=BQ92OCHu1fslE-orIXFgsXn9TTMbVOo3j1j6KkrZtHM"
        }
      },
      {
        object: "block",
        type: "file",
        data: {
          "src":
            "http://www.africau.edu/images/default/sample.pdf"
        }
      }
    ]
  }
});

export default initialValue;
