import React, { Component } from 'react'
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
  button: '',
  btn: 'btn btn-primary not-rounded border border-gray',
  dropdown: 'select col-3 inline-block mx1 not-rounded',
  input: 'input col-3 inline-block mr1',
  lastButton: 'btn btn-primary not-rounded border border-gray linebreak'
}


class Home extends Component {
  state = {
    state: null
  }
  onChange(state) {
    this.setState({ state })
  }
  render() {
    return (
      <div className="container page--home">
        
        <SlateEditor plugins={plugins}>
          <SlateToolbar>
            <BoldButton className={classNames.button} />
            <ItalicButton className={classNames.button} />
            <UnderlineButton className={classNames.button} />
            <StrikethroughButton className={classNames.button} />
            <AlignmentButtonBar className={classNames.button} />
            <LinkButton className={classNames.button} />
            <ListButtonBar className={classNames.button} />
            <ImageButton className={classNames.button} 
              signingUrl={
                window.location.origin + '/assets'
              }
            />
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
