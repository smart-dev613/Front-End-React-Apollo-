import React, { Component } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core'
import { Translation, Trans } from 'react-i18next'

interface ParentProps {
  text?: string
  addClassName?: string
  warning?: boolean
  onClick: (e: React.MouseEvent | React.FormEvent) => void
  disabled?: boolean
  icon?: any
  textHide?: boolean
  shadow?: boolean
  faPrefix?: IconPrefix
  fontIcon?: any
  style?:any
}

type Props = ParentProps

class Button extends Component<Props> {
  public constructor (props: Props) {
    super(props)
    this.state = {
      hoverin: false,
      disabled: false
    }
  }

  public render () {
    const { addClassName, text, warning, icon, textHide, shadow, faPrefix, fontIcon, style } = this.props

    let isWarning = warning ? 'btnwarning' : ''
    let addClassNamees = addClassName ? addClassName : ''
    let isShadow = shadow ? '__shadow' : ''
    let prefix: IconPrefix = faPrefix ? faPrefix : 'fas'
    return (
      <Translation>
        {() => (
          <StyledButton
            style={style}
            onClick={this.props.onClick}
            className={`btn ${addClassNamees} ${isWarning} ${isShadow}`}
            type="button"
            disabled={this.props.disabled}
          >
            {icon ? <FontAwesomeIcon className="m-0 mr-1" icon={[prefix, icon]} /> : ''}
            {fontIcon ? <FontAwesomeIcon className="m-0 mr-1" icon={fontIcon} /> : ''}
            {text ? (
              <span className={`${textHide ? 'button-children' : ''}`}>
                <Trans i18nKey={`${text}Btn`}>{text}</Trans>
              </span>
            ) : (
              ''
            )}
          </StyledButton>
        )}
      </Translation>
    );
  }
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  svg.svg-inline--fa {
    margin-right: 10px;
  }

  &.btnwarning {
    font-style: italic;
    font-weight: 500;
  }

  z-index: 0 !important;

  span {
    font-family: inherit;
  }

  .button-children {
    display: none;
  }

  @media only screen and (min-width: 577px) {
    .button-children {
      display: flex;
    }
  }
`

export default Button
