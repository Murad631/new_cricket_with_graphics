import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PlayerGateway {
   private readonly instanceId = randomUUID();
  @WebSocketServer()
  server: Server;

  // Function to emit payload to frontend
  setPalyersOnSB(payload: any) {
    this.server.emit('setPlayers', payload);
  }



   @OnEvent('switch-player', { async: true })
    switchPlayer(payload: any) {
     this.server.emit('swictPlayerUpDown', payload);
  }
  

    @OnEvent('match_state_message', { async: true })
    message(payload: any) {
     this.server.emit('show_message', payload);
  }
  



@OnEvent('scoreboard.updated', { async: true })
handleScoreboardUpdate(scoreboard: any) {
  if (!this.server) return;
  this.server.emit('scoreboard', scoreboard);
}



 @OnEvent('scoreboard.players.update', { async: true })

  updateScoreBoard(payload: any) {
    
    this.server.emit('setPlayers', payload);
  }


  @OnEvent('scoreboard.dynamic.text', { async: true })
  dynamicText(payload: any) {
    this.server.emit('dynamicText', payload);
  }



  @OnEvent('show-crr', { async: true })
  cRRText(payload: any) {
    this.server.emit('show-crr', payload);
  }


  @OnEvent('show-rrr', { async: true })
    rRRText(payload: any) {
    this.server.emit('show-rrr', payload);
  }
  
  @OnEvent('graphic_event', { async: true })
  handleGraphicEvent(payload: any) {
    if(this.server) this.server.emit('graphic_event', payload);
  }
  
  

} 