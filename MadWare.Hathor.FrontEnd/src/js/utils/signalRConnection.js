
class SignalRConnection {

  constructor(baseUrl){
    this.baseUrl = baseUrl;
    this.hub = $.connection.hathorHub;
    $.connection.hub.url = this.baseUrl + "/signalr";
  }

  setReceiveMessageCallback(callbackFunction){
    this.hub.client.receiveMessage = callbackFunction;
  }

  connect(doneFunction){
    $.connection.hub.start().done( doneFunction );
  }

  registerServer(id){
    this.hub.server.registerServer(id);
  }

  registerClient(id, serverId) {
    this.hub.server.registerClient(id, serverId);
  }

  disconnect(){
    $.connection.hub.stop();
  }

}

export default SignalRConnection;
