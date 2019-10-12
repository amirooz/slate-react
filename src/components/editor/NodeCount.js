import React from 'react'
import { css } from 'emotion'

export default function NodeCount(options) {
  return {
    renderEditor(props, editor, next) {
      const { value } = editor
      const { document } = value
      const children = next()
      let wordCount = 0
      let nodeCount = document._values._tail.array[2].size

      for (const [node] of document.blocks({ onlyLeaves: true })) {
        const words = node.text.trim().split(/\s+/)
        wordCount += words.length
      }

      return (
        <div>
          <div>{children}</div>
          <span 
            className={css`
              margin-top: 10px;
              padding: 12px;
              background-color: #ebebeb;
              display: inline-block;
            `}
          >
          Word Count: {wordCount} | Node Count: <span id="nodeCount">{nodeCount - 1}</span>
          </span>
        </div>
      )
    },
  }
}