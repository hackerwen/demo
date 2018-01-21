import React from 'react'
import style from 'raw-loader!./style1.txt';
import style2 from 'raw-loader!./style2.txt';
import resume from 'raw-loader!./resume.txt';
import showdown from 'showdown' //第三方的一个开源markdown库
import Prism from 'prismjs' //第三方的一个开源的代码染色库，非常好用
let interval

import './preStyle.css' //就是预先放置的一个css

export default class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            styleText: ``,
            DOMStyleText: ``,
            resumeText: ``,
            DOMResumeText: ``
        }
    }

    writeTo = async(nodeName, index, text) => {
        /* 一个字一个字的读咯,这样会获得丝滑柔顺的打字效果... */
        let speed = 1
        let char = text.slice(index, index + speed)
        index += speed
        if (index > text.length) {
            return //如果字打完了，就返回了
        }
        await this.wirteChars(nodeName, char)
        await this.writeTo(nodeName, index, text)
    }

    wirteChars = (nodeName, char) => new Promise((resolve) => {
        setTimeout(() => {
            if (nodeName == 'workArea') {
                const origin = this.state.DOMStyleText + char
                const html = Prism.highlight(origin, Prism.languages.css)
                this.setState({styleText: html, DOMStyleText: origin})

                this.contentNode.scrollTop = this.contentNode.scrollHeight
            } else if (nodeName == 'resume') {
                const originResume = this.state.resumeText + char
                const converter = new showdown.Converter()
                const markdownResume = converter.makeHtml(originResume)
                this.setState({resumeText: originResume, DOMResumeText: markdownResume})
                this.resumeNode.scrollTop = this.resumeNode.scrollHeight
            }
            /* 这里是控制，当遇到中文符号的？，！的时候就延长时间  */
            if (char == "？" || char == "，" || char == '！') {
                interval = 800
            } else {
                interval = 22
            }
            resolve() //一定要写的promise函数，不然你无法获得promise结果
        }, interval)
    })

    init = async() => {
        await this.writeTo('workArea', 0, style)
        await this.writeTo('resume', 0, resume)
        await this.writeTo('workArea', 0, style2)
    }

    componentDidMount() {
        this.init()
    }

    render() {
        return (
            <div>
                <div
                    className='workArea'
                    ref={(node) => {
                    this.contentNode = node
                }}>
                    <div
                        dangerouslySetInnerHTML={{
                        __html: this.state.styleText
                    }}/>
                    <style
                        dangerouslySetInnerHTML={{
                        __html: this.state.DOMStyleText
                    }}/>
                </div>
                <div
                    className='resume'
                    dangerouslySetInnerHTML={{
                    __html: this.state.DOMResumeText
                }}
                    ref={(node) => {
                    this.resumeNode = node
                }}/>
            </div>
        )
    }
}
