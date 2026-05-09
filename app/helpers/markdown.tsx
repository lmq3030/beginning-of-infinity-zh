import React, {ReactElement} from 'react'
import {marked} from 'marked'

const BacklinkTokenizerExtension: marked.TokenizerExtension = {
  name: 'backlink',
  level: 'inline',

  start: (src: string) => src.match(/\[\[/)?.index || -1,

  tokenizer: (src: string) => {
    const rule = /^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/
    const match = rule.exec(src)

    if (match) {
      const text = match[0]
      const path = match[1].trim()
      const label = (match[2] || path).trim()

      return {
        type: 'backlink',
        raw: text,
        path,
        label,
        tokens: [
          {
            type: 'text',
            raw: text,
            text: label,
          },
        ],
      }
    }
  },
}

const BacklinkRendererExtension: marked.RendererExtension = {
  name: 'backlink',

  renderer: (token: marked.Tokens.Generic) => {
    return `<a href="${token.path}">${token.label || token.path}</a>`
  },
}

marked.use({
  extensions: [BacklinkTokenizerExtension, BacklinkRendererExtension],
})

export const markdownToHtml = (markdown: string) => {
  return marked.parse(markdown)
}

export const markdownToTokens = (markdown: string) => {
  return marked.lexer(markdown)
}
