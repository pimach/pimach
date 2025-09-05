'use client';

import {useEffect, useState} from 'react';


import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';




let terminalEl: HTMLElement | null;
let term: Terminal;

import { io } from "socket.io-client";
const socket = io();



async function initTermPty( placeholder : string )
{
  terminalEl = document.getElementById('h8nTerm');
  if(terminalEl) {
    console.log(`terminal Element Id: `, terminalEl.id);

    term = new Terminal({
      convertEol: true,
    });

    // Error: ⨯ ReferenceError: self is not defined
    // Using dynamic import() inside useEffect, Move the import to your component's useEffect, then dynamically import the library
    const { FitAddon } = await import('@xterm/addon-fit');
    const termFit = new FitAddon();
    term.loadAddon(termFit);

    term.open(terminalEl);
    termFit.fit();
    
    // term.write('Hello from \x1B[1;3;31mxterm / node-pty\x1B[0m $ \r')

    // ----------------------------------------------------------------------

    // Handle terminal input
    term.onData((data) => {
      socket.emit('input', data);
    });

    // Handle terminal output
    socket.on('output', (data) => {
      term.write(data);
    });


    // Handle resize
    function resize() {
      termFit.fit();
      const dimensions = {
        cols: term.cols,
        rows: term.rows
      };
      socket.emit('resize', dimensions);
    }

    term.onResize(resize);
    window.addEventListener('resize', () => {
      resize();
    });

    term.focus();
    console.log(`flow-term# focus`); 
    term.write('Hello from \x1B[1;3;31mhong shuman\x1B[0m $ ')
  }
};




export default function FlowTerm({ pty, placeholder }: { pty: any, placeholder: string })
{
  const [isConnected, setIsConnected] = useState(false);
  const [transport,   setTransport]   = useState("N/A");

  useEffect(() => {

    initTermPty( placeholder="xterm");

    // socket.io
    // ------------------------------------------------------------------------    
    if (socket.connected) {
      onConnect();
      console.log(`flow-term# client: socket connected`); 
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);







    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  console.log(`flow-term# init ${placeholder}`);

  return (
    // <div className="relative flex flex-1 flex-shrink-0">
    <div>
      <div id="h8nTerm" className="peer block w-full h-full rounded-md border border-blue-600 py-[5px] text-sm outline-2 placeholder:text-gray-500" />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <p>Status: { isConnected ? "connected" : "disconnected" }</p>
        <p>Transport: { transport }</p> 
      </div>
    </div>
  );
}
