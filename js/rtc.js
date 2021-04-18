const servers = {
    iceServers: [{
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    }, ],
    iceCandidatePoolSize: 10,
};

// Global State
const lc = new RTCPeerConnection(servers);
lc.ondatachannel = receiveChannelCallback;
const sendChannel = lc.createDataChannel("sendChannel");
let receiveChannel = null;

// Create the data channel and establish its event listeners
sendChannel.onopen = handleSendChannelStatusChange;
sendChannel.onclose = handleSendChannelStatusChange;

let localStream = null;
let remoteStream = null;

// Handles clicks on the "Send" button by transmitting
// a message to the remote peer.

function rtcsend(input) {
    if(typeof input === 'object' && input !== null){
        sendChannel.send(JSON.stringify(input));
    }else{
        sendChannel.send(input);
    }
}

// Handle status changes on the local end of the data
// channel; this is the end doing the sending of data
// in this example.

function handleSendChannelStatusChange(event) {
    if (sendChannel) {
        var state = sendChannel.readyState;

        if (state === "open") {
            document.getElementById("status").innerHTML = "verbonden";
        } else {

        }
    }
}

function receiveChannelCallback(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = rtcreceive;
    receiveChannel.onopen = handleReceiveChannelStatusChange;
    receiveChannel.onclose = handleReceiveChannelStatusChange;
}



// Handle status changes on the receiver's channel.

function handleReceiveChannelStatusChange(event) {
    if (receiveChannel) {
        console.log("Receive channel's status has changed to " +
            receiveChannel.readyState);
    }

    // Here you would do stuff that needs to be done
    // when the channel's status changes.
}

// 2. Create an offer
const makeoffer = async () => {
    // Reference Firestore collections for signaling
    await firestore.collection('calls').doc('testroom').delete();
    const callDoc = firestore.collection('calls').doc('testroom');
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    keydisplay.innerHTML = callDoc.id;

    // Get candidates for caller, save to db
    lc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await lc.createOffer();
    await lc.setLocalDescription(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    await callDoc.set({
        offer
    });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!lc.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            lc.setRemoteDescription(answerDescription);
        }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                lc.addIceCandidate(candidate);
                console.log("should be good");
            }
        });
    });

};

// 3. Answer the call with the unique ID
const joincall = async () => {
    const callId = keyinput.value;
    const callDoc = firestore.collection('calls').doc(callId);
    const answerCandidates = callDoc.collection('answerCandidates');
    const offerCandidates = callDoc.collection('offerCandidates');

    lc.onicecandidate = (event) => {
        console.log(event);
        event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await lc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await lc.createAnswer();
    await lc.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };

    await callDoc.update({
        answer
    });

    offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                let data = change.doc.data();
                lc.addIceCandidate(new RTCIceCandidate(data));
            }
        });
    });
};