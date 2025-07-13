class PeerService{
    constructor(){
        if(!this.peer){
            this.peer = new RTCPeerConnection({
                iceServers:[
                    {
                        urls:[
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ]
                    }
                ]
            })

          
        }
    }


    async getOffer(){
        if(this.peer){
            const offer = await this.peer.createOffer()
            await this.peer.setLocalDescription(offer)
            return offer
        }
    }

    async setLocal(answer){
        console.log('setlocal', answer)
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer))
            console.log('remote description set')
        }
    }

    async getAnswer(offer){
        if(this.peer){
            console.log('offer ', offer)
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer()
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer
            
        }
    }

      // Method to nullify SDP when the user leaves
      async nullifySDP() {
        if (this.peer) {
            try {
                // Set the local and remote descriptions to null
                await this.peer.setLocalDescription(null);
                await this.peer.setRemoteDescription(null);
                
                console.log('SDP has been nullified');
            } catch (error) {
                console.error('Failed to nullify SDP:', error);
            }
        }
    }

    // Optional method to close the connection entirely
    closeConnection() {
        if (this.peer) {
            this.peer.close();
            this.peer = null;
            console.log('Peer connection has been closed');
        }
    }
}


export default new PeerService()

