//authentication complete event
vstack.onAuthenticationCompleted = function (code, authenticatedUser, msg) {
    console.log('onAuthenticationCompleted', code, msg, authenticatedUser);

    authenticatedUserData = authenticatedUser;

    //clean
    var conversations = [];
    var messages = [];
    var currentChat = {
        chatId: null,
        chatType: null,
        azStackUserID: null,
        messages: [],
        message: ''
    };
    $('#messages').empty();
    $('#conversations').empty();

    //get list after authenticated
    vstack.azGetListModifiedConversationsPage(1, 0); //page 1, last update 0 as start from newest
    // vstack.azSendMessage('hello', 'tester2', msgId++);
};

//list conversations event
vstack.onListModifiedConversationReceived = function (packet) {
    console.log('onListModifiedConversationReceived', packet);
    conversations = conversations.concat(packet.list);
    if (packet.done === 0) {
        //there are conversations left
        vstack.azGetListModifiedConversationsPage(packet.page + 1, packet.list[0].modified); //next page, start from the oldest in previous page
    }
    if (packet.done === 1) {
        //all done, display the conversations list
        conversations.map(function (conversation) {
            var html = '<div class="conversation" onclick="startChat(' + conversation.type + ', ' + (conversation.type === 1 ? conversation.chatTarget.userId : conversation.chatTarget.id) + ', \'' + (conversation.type === 1 ? conversation.chatTarget.azStackUserID : '') + '\')">' +
                (conversation.type === 1 ? conversation.chatTarget.fullname : conversation.chatTarget.name) +
                '</div>';
            //note: each conversation also contains the last message in it
            $('#conversations').append(html);
        });
    }
};

//list unread messages event
vstack.onListUnreadMessagesReceived = function (packet) {
    console.log('onListUnreadMessagesReceived', packet);

    packet.list.map(function (unreadMessage) {
        currentChat.messages.unshift(unreadMessage);
    });

    if (packet.done === 0) {
        //there are unread messages left
        vstack.azGetListUnreadMessages(packet.page + 1, currentChat.chatType, currentChat.chatId) //next page
    }
    if (packet.done === 1) {
        //all done, get the messages list
        vstack.azGetListModifiedMessagesPage(1, 0, currentChat.chatType, currentChat.chatId) //get messages, page 1, last update 0 as start from newest, type is 1 for 1-1 chat, type is for group chat, chatId is VStackUserId for 1-1 chat, chatId is group id for group chat
    }
};

//list messages event
vstack.onListModifiedMessagesReceived = function (packet) {
    console.log('onListModifiedMessagesReceived', packet);

    packet.list.map(function (message) {
        currentChat.messages.unshift(message);
    });

    if (packet.done === 0) {
        //there are messages left
        vstack.azGetListModifiedMessagesPage(packet.page + 1, packet.list[0].modified, currentChat.chatType, currentChat.chatId); //next page, start from the oldest in previous page, type is 1 for 1-1 chat, type is for group chat, chatId is VStackUserId for 1-1 chat, chatId is group id for group chat
    }
    if (packet.done === 1) {
        //all done, display the messages list
        currentChat.messages.map(function (message) {
            var html = '<div class="message">' +
                '<b>' +
                message.sender.fullname + ': ' +
                '</b>' +
                message.msg +
                '</div>';
            //note: neside of normal text message there are orther messages' type as sticker, files (video, audio, photo, ...), video/audio call, ...
            $('#messages').append(html);
        });
        setTimeout(function () {
            $('#messages').stop().animate({
                scrollTop: $('#messages')[0].scrollHeight
            }, 500);
        }, 0);
    }
};

//new message events
vstack.onGroupMessageReceived = function (packet) {
    if (currentChat.chatType !== 2 || currentChat.chatId !== packet.group.id) {
        return;
    }

    var m = {
        msgId: packet.msgId ? packet.msgId : packet.id,
        created: Date.now(),
        status: 2,
        sender: packet.from,
        receiver: packet.group,
        msgType: packet.type ? packet.type : (packet.lat && packet.long) ? 4 : 0,
        serviceType: 146,
        url: packet.url,
        fileLength: packet.fileLength,
        fileName: packet.fileName,
        addr: packet.addr,
        lat: packet.lat,
        long: packet.long,
        duration: packet.duration,
        msg: packet.msg,
        catId: packet.catId,
        imgName: packet.imgName,
        width: packet.width,
        height: packet.height,
        senderId: packet.from.userId,
        receiverId: packet.group.id,
        group: packet.group.id,
        chatType: 2
    };
    currentChat.messages.unshift(m);

    var html = '<div class="message">' +
        '<b>' +
        m.sender.fullname + ': ' +
        '</b>' +
        m.msg +
        '</div>';
    //note: neside of normal text message there are orther messages' type as sticker, files (video, audio, photo, ...), video/audio call, ...
    $('#messages').append(html);
    setTimeout(function () {
        $('#messages').stop().animate({
            scrollTop: $('#messages')[0].scrollHeight
        }, 500);
    }, 0);
};
vstack.onMessageReceived = function (user, msg) {
    if (currentChat.chatType !== 1 || currentChat.chatId !== user.userId) {
        return;
    }

    var m = {
        msgId: msg.msgId,
        created: Date.now(),
        status: 2,
        sender: user,
        receiver: authenticatedUserData,
        msgType: msg.type ? msg.type : (msg.lat && msg.long) ? 4 : 0,
        serviceType: 146,
        url: msg.url,
        fileLength: msg.fileLength,
        fileName: msg.fileName,
        addr: msg.addr,
        lat: msg.lat,
        long: msg.long,
        duration: msg.duration,
        msg: msg.msg,
        catId: msg.catId,
        imgName: msg.imgName,
        width: msg.width,
        height: msg.height,
        senderId: user.userId,
        receiverId: authenticatedUserData.userId,
        chatType: 1
    };
    currentChat.messages.unshift(m);

    var html = '<div class="message">' +
        '<b>' +
        m.sender.fullname + ': ' +
        '</b>' +
        m.msg +
        '</div>';
    //note: neside of normal text message there are orther messages' type as sticker, files (video, audio, photo, ...), video/audio call, ...
    $('#messages').append(html);
    setTimeout(function () {
        $('#messages').stop().animate({
            scrollTop: $('#messages')[0].scrollHeight
        }, 500);
    }, 0);
};
vstack.onMessageFromMe = function (packet) {
    var chatTargetId = packet.chatType === 1 ? packet.to.userId : packet.group.id;
    if (currentChat.chatType !== packet.chatType || currentChat.chatId !== chatTargetId) {
        return;
    }

    var m = {
        msgId: packet.msgId,
        created: Date.now(),
        status: 1,
        sender: authenticatedUserData,
        receiver: packet.chatType === 1 ? packet.to : packet.group,
        msgType: packet.type ? packet.type : (packet.lat && packet.long) ? 4 : 0,
        serviceType: packet.serviceType ? packet.serviceType : 146,
        url: packet.url,
        fileLength: packet.fileLength,
        fileName: packet.fileName,
        addr: packet.addr,
        lat: packet.lat,
        long: packet.long,
        duration: packet.duration,
        msg: packet.msg,
        catId: packet.catId,
        imgName: packet.imgName,
        width: packet.width,
        height: packet.height,
        senderId: authenticatedUserData.userId,
        receiverId: packet.chatType === 1 ? packet.to.userId : packet.group.id,
        group: packet.chatType === 1 ? undefined : packet.group.id,
        chatType: packet.chatType
    };
    currentChat.messages.unshift(m);

    var html = '<div class="message">' +
        '<b>' +
        m.sender.fullname + ': ' +
        '</b>' +
        m.msg +
        '</div>';
    //note: neside of normal text message there are orther messages' type as sticker, files (video, audio, photo, ...), video/audio call, ...
    $('#messages').append(html);
    setTimeout(function () {
        $('#messages').stop().animate({
            scrollTop: $('#messages')[0].scrollHeight
        }, 500);
    }, 0);
};
