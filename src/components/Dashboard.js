import React, { Component } from 'react'
import { Editor, getEventTransfer } from 'slate-react'
import { Block, Value } from 'slate'
import InitialValue from './editor/InitialValue'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { css } from 'emotion'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from './editor/Components'
import NodeCount from './editor/NodeCount'
import {PDFtoIMG} from 'react-pdf-to-image'

const DEFAULT_NODE = 'paragraph'
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')
const plugins = [
    NodeCount()
]
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

class Dashboard extends Component {
    state = {
        value: InitialValue,
        file: null
    }

    

    hasMark = (type) => {
        const { value } = this.state
        return value.activeMarks.some(mark => mark.type === type)
    }

    hasBlock = (type) => {
        const { value } = this.state
        return value.blocks.some(node => node.type === type)
    }

    wrapLink = (editor, href) => {
        editor.wrapInline({
          type: 'link',
          data: { href },
        })
      
        editor.moveToEnd()
    }

    unwrapLink = (editor) => {
        editor.unwrapInline('link')
    }

    hasLinks = () => {
        const { value } = this.state
        return value.inlines.some(inline => inline.type === 'link')
    }

    ref = (editor) => {
        this.editor = editor
    }

    renderInline = (props, editor, next) => {
        const { attributes, children, node } = props
    
        switch (node.type) {
            case 'link': {
                const { data } = node
                const href = data.get('href')
                return (
                <a {...attributes} href={href}>
                    {children}
                </a>
                )
            }
        
            default: {
                return next()
            }
        }
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
            case 'heading-one':
                return <h1 {...attributes}>{children}</h1>
            case 'heading-two':
                return <h2 {...attributes}>{children}</h2>
            case 'list-item':
                return <li {...attributes}>{children}</li>
            case 'numbered-list':
                return <ol {...attributes}>{children}</ol>
            case 'bulleted-list':
                return <ul {...attributes}>{children}</ul>
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
                    <PDFtoIMG file={src}>
                        {({pages}) => {
                            if (!pages.length) return 'Loading...';
                            return pages.map((page, index)=>
                                <img key={index} src={page} alt={page} />
                            );
                        }}
                    </PDFtoIMG>
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
        const node = document.getElementById('nodeCount').innerText
        const nodeLimit = parseInt(document.getElementById('nodeLimit').innerText)
        console.log(nodeLimit)
        const content = JSON.stringify(this.state.value.toJSON())
        if( node <= nodeLimit ) {
            localStorage.setItem('content', content)
            alert('Save data local storage')
        } else {
            alert('Exceed node limit! Node limit is ' + nodeLimit)
        }
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

    onClickLink = event => {
        event.preventDefault()
    
        const { editor } = this
        const { value } = editor
        const hasLinks = this.hasLinks()
    
        if (hasLinks) {
            editor.command(this.unwrapLink)
        } else if (value.selection.isExpanded) {
            const href = window.prompt('Enter the URL of the link:')
        
            if (href == null) {
                return
            }
        
            editor.command(this.wrapLink, href)
        } else {
            const href = window.prompt('Enter the URL of the link:')
        
            if (href == null) {
                return
            }
        
            const text = window.prompt('Enter the text for the link:')
        
            if (text == null) {
                return
            }
    
            editor
                .insertText(text)
                .moveFocusBackward(text.length)
                .command(this.wrapLink, href)
        }
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
        if (editor.value.selection.isCollapsed) return next()

        const transfer = getEventTransfer(event)
        const { type, text, files } = transfer

        if (type !== 'text' && type !== 'html') return next()
        if (!isUrl(text)) return next()

        if (this.hasLinks()) {
        editor.command(this.unwrapLink)
        }

        editor.command(this.wrapLink, text)

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

    onClickBrowseImage = (event) => {
        event.preventDefault()
        const fileSelector = document.createElement('input')
        fileSelector.setAttribute('type', 'file')
        fileSelector.setAttribute('id', 'image')
        fileSelector.setAttribute('accept', '.jpg,.png,.svg,.gif')
        fileSelector.click()
        const docs = event.target.value
        if (!fileSelector) return
        console.log(docs)
        return fileSelector
        // const src = fileSelector
        // if (!src) return
        // this.editor.command(this.insertImage, src)
    }

    onClickFile = event => {
        event.preventDefault()
        const src = window.prompt('Enter the URL of the file:')
        if (!src) return
        this.editor.command(this.insertFile, src)
    }

    onClickBrowseFile = (event) => {
        event.preventDefault()
        const fileSelector = document.createElement('input')
        fileSelector.setAttribute('type', 'file')
        fileSelector.setAttribute('id', 'pdffile')
        fileSelector.setAttribute('accept', '.pdf, .txt')
        fileSelector.click()
        const docs = event.target.value
        if (!fileSelector) return
        console.log(docs)
        return fileSelector
        // const src = fileSelector
        // if (!src) return
        // this.editor.command(this.insertFile, src)
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
            <div className="container">
                <div className="dashboard">
                    <Toolbar>
                        {this.renderMarkButton('bold', 'format_bold')}
                        {this.renderMarkButton('italic', 'format_italic')}
                        {this.renderMarkButton('underlined', 'format_underlined')}
                        {this.renderMarkButton('code', 'code')}
                        {this.renderBlockButton('heading-one', 'looks_one')}
                        {this.renderBlockButton('heading-two', 'looks_two')}
                        {this.renderBlockButton('block-quote', 'format_quote')}
                        <Button active={this.hasLinks()} onMouseDown={this.onClickLink}>
                            <Icon>link</Icon>
                        </Button> 
                        {/* <Button onMouseDown={this.toggleUnorderedList}>
                            <Icon>format_list_bulleted</Icon>
                        </Button>
                        <Button onMouseDown={this.toggleOrderedList} >
                            <Icon>format_list_numbered</Icon>
                        </Button>
                        <Button onMouseDown={this.indent} >
                            <Icon>format_indent_increase</Icon>
                        </Button>
                        <Button onMouseDown={this.outdent} >
                            <Icon>format_indent_decrease</Icon>
                        </Button> */}
                        <Button onMouseDown={this.onClickImage} title="Upload image from url">
                            <Icon>image</Icon>
                        </Button>
                        <Button onMouseDown={this.onClickBrowseImage} title="Upload image from file browser">
                            <Icon>broken_image</Icon>
                        </Button>
                        <Button onMouseDown={this.onClickFile} title="Attach file from url">
                            <Icon>attach_file</Icon>
                        </Button>
                        <Button onMouseDown={this.onClickBrowseFile} title="Upload file from file browser">
                            <Icon>file_upload</Icon>
                        </Button>
                        <Button className="save blue right" onClick={this.saveDataLocalStorage}>Save</Button>
                        <Button className="cancel grey right" onClick={this.discardChange}>Cancel</Button>
                    </Toolbar>
                    <Editor 
                        className="editor-body"
                        spellCheck
                        autoFocus
                        placeholder="Enter some rich text..."
                        ref={this.ref}
                        value={this.state.value}
                        plugins={plugins}
                        schema={schema}
                        state={this.state.state}
                        onChange={this.onChange.bind(this)}
                        onKeyDown={this.onKeyDown}
                        onDrop={this.onDropOrPaste}
                        onPaste={this.onDropOrPaste}
                        renderMark={this.renderMark}
                        renderBlock={this.renderBlock}
                        renderInline={this.renderInline}
                    />
                </div>
            </div>
        )
    }
}

export default Dashboard
