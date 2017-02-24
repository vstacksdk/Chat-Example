//params
var conversations = [];
var messages = [];
var currentChat = {
    chatId: null,
    chatType: null,
    azStackUserID: null,
    messages: [],
    message: ''
};

var msgId = Math.floor(Date.now() / 1000);
var authenticatedUserData = null;

var vAppID = "8f6b6d607b7b6f5ec45b367c1c97ca68";
var publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApxDkgYRgUr24soveQzHXE9GqQLi8Kv0KJtd35glW8UHry6Vy7o2fCGMNDTewKLrQmFLvAoMavIT+ZWKGG0yaARJQ93GduKmQ1C9UAgc3hLlHfW/YabwgENCkUdKtrnLZdx603wxxCfrmehP7LsqEp8BaHQJeTy4FLdCofTqNb8sR836Vk5CWoc11RoYsFJqV6htmxTgpxaHG3jJZOj15ran2rDSN7/yQc+nl8YIEeqmppYWupAe1/N3MkXwmTUPqgQUkXwPbYbuvHtLKLtOaHqSjQ88Vppjg0igZO6gTjL0vY8eumtePb61Ylv8JXzZ6Y+CXoE6x8/15rjG8jCMFvwIDAQAB';
var VStackUserId = 'tester';
var userCredentials = '';
var fullname = 'Tester';
var namespace = '';

var loggingUsers = [{
    VStackUserId: 'tester',
    fullname: 'Tester',
    userCredentials: ''
}, {
    VStackUserId: 'tester2',
    fullname: 'Tester 2',
    userCredentials: ''
}];

var startConnect = function () {
    var selected = parseInt($('#select_logging_user_dropdown').val());
    VStackUserId = loggingUsers[selected].VStackUserId;
    fullname = loggingUsers[selected].fullname;
    fullname = loggingUsers[selected].fullname;
    $('#select_logging_user_dropdown').prop('disabled', 'disabled');
    $('#select_logging_user_button').prop('disabled', 'disabled');
    vstack.connect(vAppID, publicKey, VStackUserId, userCredentials, fullname, namespace);
};

var startChat = function (chatType, chatId, azStackUserID) {
    currentChat.messages = [];
    currentChat.chatId = chatId;
    currentChat.chatType = chatType;
    currentChat.azStackUserID = azStackUserID;
    $('#messages').empty();
    vstack.azGetListUnreadMessages(1, chatType, chatId) //get unread messages first, page 1, type is 1 for 1-1 chat, type is for group chat, chatId is VStackUserId for 1-1 chat, chatId is group id for group chat
};

var sendMessage = function () {

    if (!authenticatedUserData) {
        return;
    }

    var sendingMessage = $(chat_message_input).val();

    if (!$(chat_message_input).val()) {
        return;
    }
    msgId += 1;
    var m = {
        msgId: msgId,
        created: Date.now(),
        status: 0,
        sender: authenticatedUserData,
        msgType: 0,
        serviceType: 146,
        url: undefined,
        fileLength: undefined,
        fileName: undefined,
        addr: undefined,
        lat: undefined,
        long: undefined,
        chatId: currentChat.chatId,
        duration: undefined,
        msg: sendingMessage,
        catId: undefined,
        imgName: undefined,
        width: undefined,
        height: undefined,
        chatType: currentChat.chatType
    };

    if (currentChat.chatType == 2) {
        vstack.azSendMessageGroup(sendingMessage, currentChat.chatId, msgId);
    } else if (currentChat.chatType == 1) {
        vstack.azSendMessage(sendingMessage, currentChat.azStackUserID, msgId);
    }

    $(chat_message_input).val('');
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
