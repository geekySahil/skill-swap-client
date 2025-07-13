// export const createPeerConnection = (socket, mateId, setRemoteStream) => {


//     const peerConnection = new RTCPeerConnection({
//         iceServers: [
//             {
//                 urls: 'stun:stun.l.google.com:19302',
//             },
//         ],
//     });

//     // check it the is any candidate found, and emit it to the signalling server('webrtcCandidate) 

//     peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//             socket.emit('webrtcCandidate', { mateId, candidate: event.candidate });
//         }
//     };


//     // set up the track for media and data exchange
   

//     return peerConnection;
// };

// export const handleOffer = async (peerConnection, offer, socket, mateId) => {
//     // RTCSessionDescription object represents the remote peer's session description (offer or answer).
//     // setRemoteDescription sets the session description (remote) for the peerConnection
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await peerConnection.createAnswer(); // creates the answer
//     await peerConnection.setLocalDescription(answer); // sets local description
//     socket.emit('webrtcAnswer', { mateId, answer });
// };

// export const handleAnswer = async (peerConnection, answer) => {
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
// };

// export const handleCandidate = async (peerConnection, candidate) => {
//     await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
// };
