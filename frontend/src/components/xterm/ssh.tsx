import React from 'react'
import { FitAddon } from 'xterm-addon-fit';
import io from "socket.io-client";

import { XTerm } from '.'

class SSHTerminal extends React.Component {
  private xtermRef: React.RefObject<XTerm>;
  private fitAddon: FitAddon;

  socket;

  constructor(props) {
    super(props)

    // Create a ref
    this.xtermRef = React.createRef()
    this.fitAddon = new FitAddon();
  }

  componentDidMount() {
    this.xtermRef.current.terminal.setOption('theme', {
      background: '#151515'
    });
    this.fitAddon.fit()
    this.configureSocket()
    
    window.addEventListener('resize', this.resizeScreen, false);

    document.addEventListener('runSnippet', this.handleRunSnippet);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleRunSnippet(e) {
    console.log(e);
  }

  resizeScreen() {
    this.fitAddon.fit();
    this.socket.emit('resize', { cols: this.xtermRef.current.terminal.cols, rows: this.xtermRef.current.terminal.rows });
  }

  configureSocket = () => {
    var socket = io({
      path: "/ssh/ws"
    });

    socket.on('data', (data: string | Uint8Array) => {
      this.xtermRef.current.terminal.write(data);
    });
    
    socket.on('connect', () => {
      //this.xtermRef.current.terminal.clear();
      socket.emit('geometry', this.xtermRef.current.terminal.cols, this.xtermRef.current.terminal.rows);
    });

    socket.on('disconnect', () => {
      console.log('disconnected')
    });

    socket.on('handleError', (err: any) => {
      console.log(err);

      //this.xtermRef.current.terminal.clear();
      this.xtermRef.current.terminal.writeln(`Error: ${err}- Please refresh page`);
    });

    socket.on(
      'setTerminalOpts',
      (data: { cursorBlink: any; scrollback: any; tabStopWidth: any; bellStyle: any }) => {
        this.xtermRef.current.terminal.options.cursorBlink = data.cursorBlink;
        this.xtermRef.current.terminal.options.scrollback = data.scrollback;
        this.xtermRef.current.terminal.options.tabStopWidth = data.tabStopWidth;
        this.xtermRef.current.terminal.options.bellStyle = data.bellStyle;
      }
    );

    this.xtermRef.current.terminal.onData((data) => {
      socket.emit('data', data);
    });

    this.socket = socket;
  }

  render() {
    return (
      <React.Fragment>
        <XTerm className="ssh-terminal" addons={[this.fitAddon]} ref={this.xtermRef} />
      </React.Fragment>
    )
  }
}

export default SSHTerminal