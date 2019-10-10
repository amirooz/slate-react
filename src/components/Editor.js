import React, { Component } from 'react'
import { Editor, getEventTransfer } from 'slate-react'
// import EditList from 'slate-edit-list'
import { Block, Value } from 'slate'
import InitialValue from './InitialValue'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { css } from 'emotion'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from './Components'
import { SlateEditor, SlateToolbar, SlateContent } from 'slate-editor'
import { BoldPlugin, BoldButton } from '@slate-editor/bold-plugin'
import { ItalicPlugin, ItalicButton } from '@slate-editor/italic-plugin'
import { UnderlinePlugin, UnderlineButton } from '@slate-editor/underline-plugin'
import { StrikethroughPlugin, StrikethroughButton } from '@slate-editor/strikethrough-plugin'
import { AlignmentPlugin, AlignmentButtonBar } from '@slate-editor/alignment-plugin'
import { LinkPlugin, LinkButton } from '@slate-editor/link-plugin'
import { ListPlugin, ListButtonBar } from '@slate-editor/list-plugin'
import { FontFamilyPlugin } from '@slate-editor/font-family-plugin'
import { FontSizePlugin } from '@slate-editor/font-size-plugin'
import { ImagePlugin, ImageButton } from '@slate-editor/image-plugin'
import { ColorPlugin, ColorButton, ColorStateModel } from '@slate-editor/color-plugin'
import { GridPlugin } from '@slate-editor/grid-plugin'
import { EmbedPlugin } from '@slate-editor/embed-plugin'
import { StateLoggerButton } from '@slate-editor/state-logger'
import { ToggleReadOnlyButton } from '@slate-editor/toggle-readonly'

const DEFAULT_NODE = 'paragraph'
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

const schema = {
    document: {
        last: { type: 'paragraph' },
        normalize: (editor, { code, node, child }) => {
            switch (code) {
            case 'last_child_type_invalid': {
                const paragraph = Block.create('paragraph')
                return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
            }
            default:
                return ''
            }
        }
    },
    blocks: {
        image: {
            isVoid: true,
        }
    }
}
const fontSizePluginOptions = { initialFontSize: 16 }
const colorPluginOptions = new ColorStateModel().rgba({ r: 100, g: 100, b: 100, a: 1 }).gen()

const plugins = [
  AlignmentPlugin(),
  BoldPlugin(),
  ColorPlugin(),
  EmbedPlugin(),
  FontFamilyPlugin(),
  FontSizePlugin(fontSizePluginOptions),
  GridPlugin(),
  ImagePlugin(),
  ItalicPlugin(),
  LinkPlugin(),
  ListPlugin(),
  StrikethroughPlugin(),
  UnderlinePlugin()
]

const classNames = {
  button: 'btn btn-primary not-rounded border border-gray',
  dropdown: 'select col-3 inline-block mx1 not-rounded',
  input: 'input col-3 inline-block mr1',
  lastButton: 'btn btn-primary not-rounded border border-gray linebreak'
}


class Home extends Component {
  state = {
      value: InitialValue,
  }

  hasMark = (type) => {
      const { value } = this.state
      return value.activeMarks.some(mark => mark.type === type)
  }

  hasBlock = (type) => {
      const { value } = this.state
      return value.blocks.some(node => node.type === type)
  }

  ref = (editor) => {
      this.editor = editor
  }

  renderMarkButton = (type, icon) => {
      const isActive = this.hasMark(type)

      return (
          <Button
              active={isActive}
              onMouseDown={event => this.onClickMark(event, type)}>
              <Icon>{icon}</Icon>
          </Button>
      )
  }

  renderBlockButton = (type, icon) => {
      let isActive = this.hasBlock(type)

      if (['numbered-list', 'bulleted-list'].includes(type)) {
          const { value: { document, blocks } } = this.state

          if (blocks.size > 0) {
              const parent = document.getParent(blocks.first().key)
              isActive = this.hasBlock('list-item') && parent && parent.type === type
          }
      }

      return (
          <Button
              active={isActive}
              onMouseDown={event => this.onClickBlock(event, type)}
          >
              <Icon>{icon}</Icon>
          </Button>
      )
  }

  renderBlock = (props, editor, next) => {
      const { attributes, children, node } = props

      switch (node.type) {
          case 'block-quote':
              return <blockquote {...attributes}>{children}</blockquote>
          case 'bulleted-list':
              return <ul {...attributes}>{children}</ul>
          case 'heading-one':
              return <h1 {...attributes}>{children}</h1>
          case 'heading-two':
              return <h2 {...attributes}>{children}</h2>
          case 'list-item':
              return <li {...attributes}>{children}</li>
          case 'numbered-list':
              return <ol {...attributes}>{children}</ol>
          case 'image': {
              const src = node.data.get('src')
              return (
                      <img
                      {...attributes}
                      src={src}
                      alt={src}
                      className={css`
                          display: block;
                          max-width: 100%;
                          max-height: 20em;
                          box-shadow: ${this.isFocused ? '0 0 0 2px blue;' : 'none'};
                      `}
                      />
              )
          }
          case 'file': {
              const src = node.data.get('src')
              return (
                  <img
                  {...attributes}
                  src={src}
                  alt={src}
                  className={css`
                      display: block;
                      max-width: 100%;
                      max-height: 20em;
                      box-shadow: ${this.isFocused ? '0 0 0 2px blue;' : 'none'};
                  `}
                  />
              )
          }
          default:
              return next()
      }
  }

  renderMark = (props, editor, next) => {
      const { children, mark, attributes } = props

      switch (mark.type) {
          case 'bold':
              return <strong {...attributes}>{children}</strong>
          case 'code':
              return <code {...attributes}>{children}</code>
          case 'italic':
              return <em {...attributes}>{children}</em>
          case 'underlined':
              return <u {...attributes}>{children}</u>
          default:
              return next()
      }
  }

  onChange = ({ value }) => {
      this.setState({ value })
  }

  saveDataLocalStorage = ({ value }) => {
      const content = JSON.stringify(this.state.value.toJSON())
      localStorage.setItem('content', content)
      this.setState({ })
  }

  discardChange = () => {
      const existingValue = JSON.parse(localStorage.getItem('content'))
      const value = Value.fromJSON(existingValue || InitialValue )
      this.setState({ value })
  }

  onKeyDown = (event, editor, next) => {
      let mark

      if (isBoldHotkey(event)) {
          mark = 'bold'
      } else if (isItalicHotkey(event)) {
          mark = 'italic'
      } else if (isUnderlinedHotkey(event)) {
          mark = 'underlined'
      } else if (isCodeHotkey(event)) {
          mark = 'code'
      } else {
          return next()
      }

      event.preventDefault()
      editor.toggleMark(mark)
  }

  onClickMark = (event, type) => {
      event.preventDefault()
      this.editor.toggleMark(type)
  }

  onClickBlock = (event, type) => {
      event.preventDefault()

      const { editor } = this
      const { value } = editor
      const { document } = value

      // Handle everything but list buttons.
      if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isActive = this.hasBlock(type)
        const isList = this.hasBlock('list-item')

          if (isList) {
              editor
              .setBlocks(isActive ? DEFAULT_NODE : type)
              .unwrapBlock('bulleted-list')
              .unwrapBlock('numbered-list')
          } else {
              editor.setBlocks(isActive ? DEFAULT_NODE : type)
          }
      } else {
          // Handle the extra wrapping required for list buttons.
          const isList = this.hasBlock('list-item')
          const isType = value.blocks.some(block => {
              return !!document.getClosest(block.key, parent => parent.type === type)
          })

          if (isList && isType) {
              editor
              .setBlocks(DEFAULT_NODE)
              .unwrapBlock('bulleted-list')
              .unwrapBlock('numbered-list')
          } else if (isList) {
              editor
              .unwrapBlock(
                  type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
              )
              .wrapBlock(type)
          } else {
              editor.setBlocks('list-item').wrapBlock(type)
          }
      }
  }

  isImage = (url) => {
      return imageExtensions.includes(this.getExtension(url))
  }

  getExtension = (url) => {
      return new URL(url).pathname.split('.').pop()
  }

  insertImage = (editor, src, target) => {
      if (target) {
          editor.select(target)
      }

      editor.insertBlock({
        type: 'image',
        data: { src },
      })
  }

  onClickImage = event => {
      event.preventDefault()
      const src = window.prompt('Enter the URL of the image:')
      if (!src) return
      this.editor.command(this.insertImage, src)
  }

  onDropOrPaste = (event, editor, next) => {
      const target = editor.findEventRange(event)
      if (!target && event.type === 'drop') return next()

      const transfer = getEventTransfer(event)
      const { type, text, files } = transfer

      if (type === 'files') {
          // eslint-disable-next-line
          for (const file of files) {
              const reader = new FileReader()
              const [mime] = file.type.split('/')
              if (mime !== 'image') continue

              reader.addEventListener('load', () => {
                  editor.command(this.insertImage, reader.result, target)
              })

              reader.readAsDataURL(file)
          }
          return
      }

      if (type === 'text') {
          if (!isUrl(text)) return next()
          if (!this.isImage(text)) return next()
          editor.command(this.insertImage, text, target)
          return
      }

      next()
  }

  onClickFile = (event) => {
      event.preventDefault()
      const fileSelector = document.createElement('input')
      fileSelector.setAttribute('type', 'file')
      fileSelector.setAttribute('accept', '.pdf, .txt')
      fileSelector.click()
      if (!fileSelector) return
      const src = fileSelector
      this.editor.command(this.insertFile, src)
  }

  insertFile = (editor, src, target) => {
      if (target) {
        editor.select(target)
      }

      editor.insertBlock({
        type: 'file',
        data: { src },
      })
  }

  render() {
    return (
      <div className="container page--home">
        <div className="dashboard">
            <Toolbar>
                {this.renderMarkButton('undo', 'undo')}
                {this.renderMarkButton('redo', 'redo')}
                {this.renderMarkButton('bold', 'format_bold')}
                {this.renderMarkButton('italic', 'format_italic')}
                {this.renderMarkButton('underlined', 'format_underlined')}
                {this.renderMarkButton('code', 'code')}
                {this.renderBlockButton('heading-one', 'looks_one')}
                {this.renderBlockButton('heading-two', 'looks_two')}
                {this.renderBlockButton('block-quote', 'format_quote')}
                {this.renderBlockButton('numbered-list', 'format_list_numbered')}
                {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
                {this.renderBlockButton('indent_decrease', 'format_indent_decrease')}
                {this.renderBlockButton('indent_increase', 'format_indent_increase')}
                <Button onMouseDown={this.onClickImage}>
                    <Icon>image</Icon>
                </Button>
                <Button onMouseDown={this.onClickFile}>
                    <Icon>attach_file</Icon>
                </Button>
                <Button className="waves-effect waves-light btn-small save blue right" onClick={this.saveDataLocalStorage}>Save</Button>
                <Button className="waves-effect waves-light btn-small cancel grey lighten-2 right" onClick={this.discardChange}>Cancel</Button>
            </Toolbar>
            <Editor
                spellCheck
                autoFocus
                placeholder="Enter some rich text..."
                ref={this.ref}
                value={this.state.value}
                schema={schema}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                onDrop={this.onDropOrPaste}
                onPaste={this.onDropOrPaste}
                renderMark={this.renderMark}
                renderBlock={this.renderBlock}
            />
        </div>
        <div className='header'>
            <h4>A rich text editor based on SlateJS for Twisker</h4>
            <p></p>
        </div>
        <SlateEditor plugins={plugins}>
          <SlateToolbar>
            <BoldButton className={classNames.button} />
            <ItalicButton className={classNames.button} />
            <UnderlineButton className={classNames.button} />
            <StrikethroughButton className={classNames.button} />
            <AlignmentButtonBar className={classNames.button} />
            <LinkButton className={classNames.button} />
            <ListButtonBar className={classNames.button} />
            <ImageButton className={classNames.button} />
            <ColorButton
              className={classNames.button}
              initialState={colorPluginOptions}
              pickerDefaultPosition={{ x: -520, y: 17 }}
            />
          </SlateToolbar>

          <SlateContent />

          <SlateToolbar className='toolbar--footer'>
            <StateLoggerButton className={classNames.button} />
            <ToggleReadOnlyButton className={classNames.button} />
          </SlateToolbar>
        </SlateEditor>
        
      </div>
      
    )
  }
}

export default Home